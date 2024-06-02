import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { NotificationGatewayService } from './notification-server.service';
import { PaginationPayloadDto } from './dto/pagination-payload.dto';
import { InvitationDocument } from 'src/invitation/entities/invitation.entity';
import { ReplyInvitationDto } from 'src/invitation/dto/reply-invitaion.dto';
import { CreateInvitationDto } from 'src/invitation/dto/create-invitation.dto';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly notificationGatewayService: NotificationGatewayService,
  ) {}

  // * [Event] [find-user-by-username]
  @SubscribeMessage('find-user-by-username')
  async handleFindUserByUsernameEvent(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    username: string,
  ) {
    const user = await this.notificationGatewayService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('[find-user-by-username] Unauthorized client disconnected');
      return;
    }

    const foundUser =
      await this.notificationGatewayService.findUserByUsername(username);
    if (!foundUser) {
      client.emit('user-not-found', 'User not found');
      return false;
    }

    client.emit('user-found', foundUser);
    return true;
  }

  @SubscribeMessage('incoming-invitation')
  async handleIncomingInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: CreateInvitationDto,
  ) {
    console.log('[incoming-invitation] New invitation received', payload);
    const user = await this.notificationGatewayService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('[incoming-invitation] Unauthorized client disconnected');
      return;
    }

    client.emit('new-invitation', payload);

    this.notificationGatewayService.saveInvitation(payload);
  }

  @SubscribeMessage('fetch-received-invitations')
  async fetchReceivedInvitaions(
    @ConnectedSocket() client: Socket,
    payload: PaginationPayloadDto,
  ) {
    const user = await this.notificationGatewayService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log(
        '[fetch-received-invitations] Unauthorized client disconnected',
      );
      return;
    }

    const invitations: InvitationDocument[] =
      await this.notificationGatewayService.fetchReceivedInvitaions(
        user._id.toString(),
        payload,
      );

    client.to(client.id).emit('received-invitations', invitations);
    console.log(
      `[fetch-received-invitations] Received invitations of ${user.username} are sent to room ${client.id}`,
    );
  }

  @SubscribeMessage('fetch-sent-invitations')
  async fetchSentInvitaions(
    @ConnectedSocket() client: Socket,
    payload: PaginationPayloadDto,
  ) {
    const user = await this.notificationGatewayService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('[fetch-sent-invitations] Unauthorized client disconnected');
      return;
    }

    const invitations: InvitationDocument[] =
      await this.notificationGatewayService.fetchSentInvitaions(
        user._id.toString(),
        payload,
      );

    client.to(client.id).emit('sent-invitations', invitations);
    console.log(
      `[fetch-sent-invitations] Sent invitations of ${user.username} are sent to room ${client.id}`,
    );
  }

  @SubscribeMessage('rely-to-invitation')
  async replyToInvitation(
    @ConnectedSocket() client: Socket,
    payload: ReplyInvitationDto,
    paginationPayload: PaginationPayloadDto,
  ) {
    const user = await this.notificationGatewayService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('[rely-to-invitation] Unauthorized client disconnected');
      return;
    }

    const repliedInvitation: InvitationDocument =
      await this.notificationGatewayService.replyToInvitaion(
        user._id.toString(),
        payload,
      );
    console.log(
      `[rely-to-invitation] Invitation [${repliedInvitation._id}] replied by ${user.username}`,
    );

    const invitations: InvitationDocument[] =
      await this.notificationGatewayService.fetchReceivedInvitaions(
        user._id.toString(),
        paginationPayload,
      );

    client.to(client.id).emit('sent-invitations', invitations);
    console.log(
      `[rely-to-invitation] Sent invitations of ${user.username} are sent to room ${client.id}`,
    );
  }
}
