import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { ChatService } from "./chat.service";

@WebSocketGateway({cors: true})
export class ChatGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly chatService: ChatService) {}

    @SubscribeMessage('send-message')
    async handleIncomingMessage(client: Socket, payload: any) {
        const roomId = payload.roomId;
        const message = payload.message;
        const sender = payload.sender;
        console.log('client sending message:', client.id);
        console.log('payload:', payload);
        console.log('roomId:', roomId);
        console.log('message:', message);
        console.log('sender:', sender);

        if (roomId === '') {
            client.broadcast.emit('receive-message', payload);
        }
        else {
            client.to(roomId).emit('receive-message', payload);
        }
    }

    @SubscribeMessage('join-room')
    async handleJoinRoom(client: Socket, payload: any) {
        for (let room of client.rooms.keys()) {
            if (room !== client.id) {
                client.leave(room);
                console.log(`client ${client.id} leaving room:`, room);
            }
        }

        const roomId = payload.roomId;
        const username = payload.username;
        console.log('client joining room:', client.id);
        console.log('payload:', payload);
        console.log('roomId:', roomId);
        console.log('username:', username);

        client.join(roomId);
        client.to(roomId).emit('receive-message', {
            roomId: roomId,
            message: `${username} has joined the room.`,
            sender: 'server'
        });
    }
}