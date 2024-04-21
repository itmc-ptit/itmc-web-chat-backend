import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { MessagePayLoad } from './dto/message.payload.dto';
import { JoinRoomPayload } from './dto/join-room.payload.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('send-message')
  async handleIncomingMessage(client: Socket, payload: MessagePayLoad) {
    console.log('client sending message:', client.id);
    console.log('payload:', payload);
    console.log('roomId:', payload.groupChatId);
    console.log('message:', payload.message);
    console.log('userId:', payload.userId);

    // * Save the message to the database
    this.chatService.handleMessage(payload);

    // * Broadcast the message to the room
    client.to(payload.groupChatId).emit('receive-message', payload);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(client: Socket, payload: JoinRoomPayload) {
    // * Leave all rooms except for the client's own room
    for (let room of client.rooms.keys()) {
      if (room !== client.id) {
        client.leave(room);
        console.log(`client ${client.id} leaving room:`, room);
      }
    }

    const roomId = payload.roomId;
    const userId = payload.userId;
    console.log('client joining room:', client.id);
    console.log('payload:', payload);
    console.log('roomId:', roomId);
    console.log('username:', userId);

    // * Join the room
    client.join(payload.roomId);

    // * Broadcast messages history to the user
    // const messages = this.chatService.handleUserJoined(payload);
    // if (messages) {
    //   console.log('sending messages');
    //   let counter: number = 0;
    //   for (let message of await messages) {
    //     counter++;
    //     client.emit('receive-message', {
    //       roomId: roomId,
    //       message: message.message,
    //       userId: message.userId,
    //       attachment: message.attachment,
    //     });
    //     // console.log('message:', message);
    //   }
    //   console.log('sent', counter, 'messages');
    // }

    // * Broadcast a message to the room to notify that a user has joined
    // client.to(payload.roomId).emit('receive-message', {
    //   roomId: roomId,
    //   message: `${userId} has joined the room.`,
    //   userId: 'server',
    // });
  }
}
