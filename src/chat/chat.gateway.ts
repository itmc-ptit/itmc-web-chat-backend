import {
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
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('send-message')
  async handleSendMessageEvent(client: Socket, payload: MessagePayLoad) {
    this.chatService.saveNewMessages(payload);

    client.to(payload.groupChatId).emit('receive-message', payload);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoomEvent(client: Socket, payload: JoinRoomPayload) {
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
