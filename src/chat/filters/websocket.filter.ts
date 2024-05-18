import { Catch, WsExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class AllWsExceptionsFilter implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const data = host.switchToWs().getData();

    const status = exception instanceof WsException ? 'error' : 'fatal';

    const message = exception.message || 'Unknown WebSocket error';

    client.emit('exception', {
      status: status,
      message: message,
      data: data,
    });
  }
}
