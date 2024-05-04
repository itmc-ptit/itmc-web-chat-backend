import { Module } from '@nestjs/common';
import { ChatBanService } from './chat-ban.service';
import { ChatBanController } from './chat-ban.controller';
import { ChatBan, ChatBanSchema } from './entities/chat-ban.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatBan.name, schema: ChatBanSchema, collection: 'chat_bans' },
    ]),
  ],
  controllers: [ChatBanController],
  providers: [ChatBanService],
})
export class ChatBanModule {}
