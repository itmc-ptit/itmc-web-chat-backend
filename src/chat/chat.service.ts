import { Injectable } from '@nestjs/common';
import { MessagePayLoad } from './dto/message.payload.dto';
import { Socket } from 'socket.io';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { CreateChatHistoryDto } from 'src/chat-history/dto/create-chat-history.dto';
import { FetchChatHistoryDto } from 'src/chat-history/dto/fetch-chat-history.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

/**
 * ! Error: Cannot user the websocket filter to filter the WsException
 * TODO: Use WsExceptionFilter to filter the WsException
 */
@Injectable()
export class ChatService {
  constructor(
    private readonly chatHistoryService: ChatHistoryService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // TODO: implement exception handling
  async authorizeClient(client: Socket) {
    const token = await this.getAuthToken(client);
    if (!token) {
      return null;
    }
    const claims = await this.authorizeTohen(token);
    if (!claims) {
      return null;
    }

    const user = await this.userService.findById(claims.sub);
    if (!user) {
      return null;
    }

    return user;
  }

  async saveNewMessages(payload: MessagePayLoad) {
    const newChatHistory: CreateChatHistoryDto = {
      userId: payload.userId,
      groupChatId: payload.groupChatId,
      message: payload.message,
      attachment: payload.attachements,
    };

    await this.chatHistoryService.create(newChatHistory);
  }

  async fetchChatHistory(payload: FetchChatHistoryDto) {
    return await this.chatHistoryService.findAllByGroupChatId(payload);
  }

  private async getAuthToken(client: Socket): Promise<string> {
    const token = client.handshake.headers?.authorization;
    if (!token) {
      return null;
    }
    return token;
  }

  private async authorizeTohen(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return {
        ...decoded,
        id: decoded.sub,
      };
    } catch (error) {
      return null;
    }
  }
}
