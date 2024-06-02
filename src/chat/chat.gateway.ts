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
import { IncomingInvitaionPayload } from './dto/incoming-invitaion.payload.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private conversationsDictionary = new Map<
    string,
    Map<string, ClientInformation>
  >();

  constructor(private readonly chatService: ChatService) {}

  // * [Event] [connection]
  async handleConnection(client: Socket) {
    const user = await this.chatService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('[Connection] Unauthorized client disconnected');
      return;
    }

    console.log(
      `[Connection] Client [${client.id}] of user [${user.email}] connected`,
    );
  }

  // * [Event] [disconnect]
  async handleDisconnect(client: any) {
    console.log(`[Disconnection] Client [${client.id}] disconnected`);
  }

  // * [Event] [send-message]
  @SubscribeMessage('send-message')
  async handleSendMessageEvent(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() payload: MessagePayLoad,
  ) {
    const user = await this.chatService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('[Send message] Unauthorized client disconnected');
      return;
    }

    console.log(
      `[Send message] Client [${client.id}] of user [${user.email}] sent message`,
    );

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

  // * [Event] [join-private-room]
  @SubscribeMessage('join-private-room')
  async handleJoinPrivateRoomEvent(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    userId: string,
  ) {
    const user = await this.chatService.authorizeClient(client);
    if (!user) {
      client.disconnect();
      console.log('[Join room] Unauthorized client disconnected');
      return;
    }

    if (user._id.toString() !== userId) {
      client.disconnect();
      console.log(
        `[Join room] Disconnect client [${client.id}] of forbidden user [${user.email}] - User is not the owner of the room`,
      );
      return;
    }

    console.log(
      `[Join room] Client [${client.id}] of user [${user.email}] join room [${client.id}]`,
    );

    client.join(client.id);
  }

  // * [Event] [join-room]
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
      console.log('[Join room] Unauthorized client disconnected');
      return;
    }

    const isMember = await this.chatService.verifyGroupChatMember(
      user._id,
      payload.roomId,
    );
    if (!isMember) {
      client.disconnect();
      console.log(
        `[Join room] Disconnect client [${client.id}] of forbidden user [${user.email}] - User is not a member of group chat`,
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
      `[Join room] Client [${client.id}] of user [${user.email}] join room [${payload.roomId}]`,
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

  // * [Event] [leave-room]
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
      console.log('[Leave room] Unauthorized client disconnected');
      return;
    }

    const isMember = await this.chatService.verifyGroupChatMember(
      user._id,
      payload.roomId,
    );
    if (!isMember) {
      client.disconnect();
      console.log(
        `[Leave room] Disconnect client [${client.id}] of forbidden user [${user.email}] - User is not a member of group chat`,
      );
      return;
    }

    await this.removeMemberFromDictionary(client.id, user, payload.roomId);
    client.leave(payload.roomId);

    console.log(
      `[Leave room] Client [${client.id}] of user [${user.email}] leave room [${payload.roomId}]`,
    );
  }

  // * [Event] [find-user-by-username]
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
      console.log('[Find user by username] Unauthorized client disconnected');
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

  // TODO: complete this function
  // * [Event] [incoming-invitation]
  @SubscribeMessage('incoming-invitation')
  async handleIncomingInvitaionEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: IncomingInvitaionPayload,
  ) {
    console.log(
      '[Incoming invitaion] Received incoming invitation, payload:',
      payload,
    );

    const user = await this.chatService.authorizeClient(client);
    if (!user) {
      console.log('[Incoming invitaion] Unauthorized client disconnected');
      client.disconnect();
      return;
    }

    if (user._id.toString() !== payload.inviterId) {
      console.log(
        `[Incoming invitaion] Disconnect client [${client.id}] of forbidden user [${user.email}] - User is not the inviter`,
      );
      client.disconnect();
      return;
    }

    const isHost = await this.chatService.verifyGroupChatAdmin(
      user._id,
      payload.groupChatId,
    );
    if (!isHost) {
      console.log(
        `[Incoming invitaion] Disconnect client [${client.id}] of forbidden user [${user.email}] - User is not the host of the group chat`,
      );
      client.disconnect();
      return;
    }

    console.log('[Incoming invitaion] Sending invitation to client');
    client.emit('receive-invitation', payload);
    // client.to(payload.groupChatId).emit('receive-invitation', payload);
    await this.chatService.createInvitation(payload);
  }

  // * [Func] Make client leave all rooms
  private async leaveAllRooms(client: Socket) {
    for (let room of client.rooms.keys()) {
      if (room !== client.id) {
        client.leave(room);
      }
    }
  }

  // * [Func] Show conversation dictionary
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

  // * [Func] Check if client is in dictionary
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

  // * [Func] Add member to dictionary
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

  // * [Func] Remove member from dictionary
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
