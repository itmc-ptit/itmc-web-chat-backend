import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupChatSchema } from './models/group-chat.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'group_chats', schema: GroupChatSchema },
    ]),
  ],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
