import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserJoinedObserver } from './observers/user-joined.observer';
import { MessageObserver } from './observers/message.observer';
import { ChatHistoryModule } from 'src/chat-history/chat-history.module';

@Module({
  imports: [ChatHistoryModule],
  providers: [UserJoinedObserver, MessageObserver, ChatService, ChatGateway],
})
export class ChatModule {}
