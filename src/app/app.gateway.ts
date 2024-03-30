import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

// * The `@WebSocketGateway` decorator will allow the class to use the socket.io functionality
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // * An instance of the websocket server
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  // * The `@SubscribeMessage` allows the `handleMessage()` method listen to an event called `msgToServer`
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    // * The `emit()` function can be used to send data to all clients which connected to the server.
    console.log(payload);

    this.server.emit('msgToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
