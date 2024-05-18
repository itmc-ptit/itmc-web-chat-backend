import { Injectable } from '@nestjs/common';
import { MessagePayLoad } from './dto/message.payload.dto';
import { JoinRoomPayload } from './dto/join-room.payload.dto';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { CreateChatHistoryDto } from 'src/chat-history/dto/create-chat-history.dto';
import { FetchChatHistoryDto } from 'src/chat-history/dto/fetch-chat-history.dto';

@Injectable()
export class ChatService {
  constructor(private chatHistoryService: ChatHistoryService) {}

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
}
