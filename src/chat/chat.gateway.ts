import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ChatGateway.name);
    @WebSocketServer() server: Server;
    userCount: number = 0;

    afterInit(server: any) {
        console.log('Server initialized');
    }

    async handleConnection() {
        console.log('Connection established!');
        this.userCount++;
        console.log('User count: ', this.userCount);
        console.log('-----------------------------------');
    }

    async handleDisconnect() {
        console.log('Client disconected!');
        this.userCount--;
        console.log('User count: ', this.userCount);
        console.log('-----------------------------------');
    }

    @SubscribeMessage('chat')
    async onChat(client: Socket, payload: string) {

        console.log("Cilent: ", client.id);
        console.log('Message:', payload);
        this.server.emit('message', payload);
    }
}