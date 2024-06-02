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

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly notificationGatewayService: NotificationGatewayService,
  ) {}

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
