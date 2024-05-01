import { Module } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryController } from './chat-history.controller';
import { ChatHistorySchema } from './entities/chat-history.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'chat_histories', schema: ChatHistorySchema },
    ]),
  ],
  providers: [ChatHistoryService],
  controllers: [ChatHistoryController],
  exports: [ChatHistoryService],
})
export class ChatHistoryModule {}
