import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatHistoryModule } from 'src/chat-history/chat-history.module';

@Module({
  imports: [ChatHistoryModule],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
