import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupChat, GroupChatSchema } from './entities/group-chat.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GroupChat.name,
        schema: GroupChatSchema,
        collection: 'group_chats',
      },
    ]),
  ],
  controllers: [GroupChatController],
  providers: [GroupChatService],
  exports: [GroupChatService],
})
export class GroupChatModule {}
