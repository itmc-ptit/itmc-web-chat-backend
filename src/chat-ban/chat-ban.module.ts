import { Module } from '@nestjs/common';
import { ChatBanService } from './chat-ban.service';
import { ChatBanController } from './chat-ban.controller';
import { ChatBanSchema } from './entities/chat-ban.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'chat_bans', schema: ChatBanSchema }])],
  controllers: [ChatBanController],
  providers: [ChatBanService],
})
export class ChatBanModule {}
