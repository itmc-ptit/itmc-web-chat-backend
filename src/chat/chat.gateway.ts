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

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

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
    console.log('disconnected');
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

    client.to(payload.groupChatId).emit('receive-message', payload);

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
        `Forbidden client [${client.id}] of user [${user.email}] disconnected`,
      );
      return;
    }

    const isInRoom = client.rooms.has(payload.roomId);
    if (isInRoom) {
      return;
    }

    await this.leaveAllRooms(client);

    client.join(payload.roomId);

    console.log(
      `Client [${client.id}] of user [${user.email}] join room [${payload.roomId}]`,
    );

    const last10MinutesTimestamp = new Date(Date.now() - 10 * 60000);
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

  private async leaveAllRooms(client: Socket) {
    for (let room of client.rooms.keys()) {
      if (room !== client.id) {
        client.leave(room);
      }
    }
  }
}
