import { Module } from '@nestjs/common';
import { GroupChatsService } from './group-chats.service';
import { GroupChatsController } from './group-chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupChatSchema } from './models/group-chat.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'group_chats', schema: GroupChatSchema }])],
  controllers: [GroupChatsController],
  providers: [GroupChatsService],
})
export class GroupChatsModule {}
