import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { MessagePayLoad } from './dto/message.payload.dto';
import { JoinRoomPayload } from './dto/join-room.payload.dto';
import { FetchChatHistoryDto } from 'src/chat-history/dto/fetch-chat-history.dto';
import { LeaveRoomPayload } from './dto/leave-room.payload.dto';
import { ClientInformation } from './interface/client-information.interface';
import { UserDocument } from 'src/user/entities/user.model';
import { Json } from 'sequelize/types/utils';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private conversationsDictionary = new Map<
    string,
    Map<string, ClientInformation>
  >();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const user = await this.chatService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('Unauthorized client disconnected');
      return;
    }

    console.log(`Client [${client.id}] of user [${user.email}] connected`);
  }

  async handleDisconnect(client: any) {
    console.log(`Client [${client.id}] disconnected`);
  }

  @SubscribeMessage('send-message')
  async handleSendMessageEvent(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() payload: MessagePayLoad,
  ) {
    const user = await this.chatService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('Unauthorized client disconnected');
      return;
    }
    console.log(`Client [${client.id}] of user [${user.email}] sent message`);

    const sendingMessage = {
      message: payload.message,
      attachments: payload.attachements,
      userId: this.conversationsDictionary
        .get(payload.groupChatId)
        .get(client.id),
      groupChatId: payload.groupChatId,
    };
    /**
     * ! While testing with postman, this line of code emits to the client twice
     */
    // * Sending message to all other client in the same room
    client.to(payload.groupChatId).emit('receive-message', sendingMessage);

    this.chatService.saveNewMessages(payload);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoomEvent(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    payload: JoinRoomPayload,
  ) {
    const user = await this.chatService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('Unauthorized client disconnected');
      return;
    }

    const isMember = await this.chatService.verifyGroupChatMember(
      user._id,
      payload.roomId,
    );
    if (!isMember) {
      client.disconnect();
      console.log(
        `Disconnect client [${client.id}] of forbidden user [${user.email}]`,
      );
      return;
    }

    const isInRoom = client.rooms.has(payload.roomId);
    if (isInRoom) {
      return;
    }

    await this.leaveAllRooms(client);

    // * Inserting user information to the corresponding room for faster user data lookup
    await this.addMemberToDictionary(client.id, user, payload.roomId);
    client.join(payload.roomId);

    console.log(
      `Client [${client.id}] of user [${user.email}] join room [${payload.roomId}]`,
    );

    const fetchChatHistoryPayload: FetchChatHistoryDto = {
      groupChatId: payload.roomId,
      limit: 10,
    };
    const messages = await this.chatService.fetchChatHistory(
      user._id,
      fetchChatHistoryPayload,
    );

    for (let message of messages) {
      // * have to use .emit because the messages need to be sent to the client that just joined the room
      client.emit('receive-message', message);
    }
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoomEvent(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    payload: LeaveRoomPayload,
  ) {
    const user = await this.chatService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('Unauthorized client disconnected');
      return;
    }

    const isMember = await this.chatService.verifyGroupChatMember(
      user._id,
      payload.roomId,
    );
    if (!isMember) {
      client.disconnect();
      console.log(
        `Disconnect client [${client.id}] of forbidden user [${user.email}]`,
      );
      return;
    }

    await this.removeMemberFromDictionary(client.id, user, payload.roomId);
    client.leave(payload.roomId);

    console.log(
      `Client [${client.id}] of user [${user.email}] leave room [${payload.roomId}]`,
    );
  }

  @SubscribeMessage('find-user-by-username')
  async handleFindUserByUsernameEvent(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    username: string,
  ) {
    const user = await this.chatService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('Unauthorized client disconnected');
      return;
    }

    const foundUser = await this.chatService.findUserByUsername(username);
    if (!foundUser) {
      client.emit('user-not-found', 'User not found');
      return false;
    }

    client.emit('user-found', foundUser);
    return true;
  }

  private async leaveAllRooms(client: Socket) {
    for (let room of client.rooms.keys()) {
      if (room !== client.id) {
        client.leave(room);
      }
    }
  }

  private showDictionary() {
    console.log('Conversation dictionary:');
    for (let [roomId, members] of this.conversationsDictionary) {
      console.log(`Room [${roomId}]`);
      for (let [userId, member] of members) {
        console.log(`  User [${userId}]`);
      }
    }
    console.log('------------------------');
  }

  private async isClientInDictionary(
    clientId: string,
    roomId: string,
  ): Promise<boolean> {
    if (!this.conversationsDictionary.has(roomId)) {
      return false;
    }

    if (!this.conversationsDictionary.get(roomId).has(clientId)) {
      return false;
    }

    return true;
  }

  private async addMemberToDictionary(
    clientId: string,
    user: UserDocument,
    roomId: string,
  ) {
    if (user && (await this.isClientInDictionary(user._id, roomId))) {
      return;
    }

    const clientInformation: ClientInformation = {
      userId: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      photo: null, // TODO: add photo
    };

    if (this.conversationsDictionary.has(roomId)) {
      const clients: Map<string, ClientInformation> =
        this.conversationsDictionary.get(roomId);
      clients.set(clientId, clientInformation);
      this.conversationsDictionary.set(roomId, clients);
      return;
    }

    const clients = new Map<string, ClientInformation>();
    clients.set(clientId, clientInformation);
    this.conversationsDictionary.set(roomId, clients);
    this.showDictionary();
  }

  private async removeMemberFromDictionary(
    clientId: string,
    user: UserDocument,
    roomId: string,
  ) {
    if ((await this.isClientInDictionary(clientId, roomId)) === false) {
      return;
    }

    const members: Map<string, ClientInformation> =
      this.conversationsDictionary.get(roomId);
    if (members.get(clientId)) {
      members.delete(clientId);
    }
    this.conversationsDictionary.set(roomId, members);
    this.showDictionary();
  }
}
