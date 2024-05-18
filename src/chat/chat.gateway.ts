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
import { UseFilters } from '@nestjs/common';
import { AllWsExceptionsFilter } from './filters/websocket.filter';

// ! Error: Cannot user the websocket filter to filter the WsException
@UseFilters(AllWsExceptionsFilter)
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

  // TODO: add room validate
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

    console.log(
      `Client [${client.id}] of user [${user.email}] join room [${payload.roomId}]`,
    );

    await this.leaveAllRooms(client);

    client.join(payload.roomId);

    const last10MinutesTimestamp = new Date(Date.now() - 10 * 60000);
    const fetchChatHistoryPayload: FetchChatHistoryDto = {
      groupChatId: payload.roomId,
      timestamp: last10MinutesTimestamp.toString(),
      limit: 10,
    };
    const messages = await this.chatService.fetchChatHistory(
      fetchChatHistoryPayload,
    );

    for (let message of messages) {
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
