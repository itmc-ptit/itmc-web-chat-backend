import { Module } from '@nestjs/common';
import { ChatBanService } from './chat-ban.service';
import { ChatBanController } from './chat-ban.controller';

@Module({
  controllers: [ChatBanController],
  providers: [ChatBanService],
})
export class ChatBanModule {}
