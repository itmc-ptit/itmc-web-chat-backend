import { Module, forwardRef } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupChat, GroupChatSchema } from './entities/group-chat.model';
import { UserToGroupModule } from 'src/user-to-group/user-to-group.module';

@Module({
  imports: [
    // forwardRef(() => UserToGroupModule),
    MongooseModule.forFeature([
      {
        name: GroupChat.name,
        schema: GroupChatSchema,
        collection: 'group_chats',
      },
    ]),
  ],
  exports: [GroupChatService],
  providers: [GroupChatService],
  controllers: [GroupChatController],
})
export class GroupChatModule {}
