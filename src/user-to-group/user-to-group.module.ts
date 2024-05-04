import { Module } from '@nestjs/common';
import { UserToGroupService } from './user-to-group.service';
import { UserToGroupController } from './user-to-group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToGroup, UserToGroupSchema } from './entities/user-to-group.model';
import { GroupChatModule } from 'src/group-chat/group-chat.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserToGroup.name,
        schema: UserToGroupSchema,
        collection: 'user_to_groups',
      },
    ]),
    GroupChatModule,
    UserModule,
  ],
  controllers: [UserToGroupController],
  providers: [UserToGroupService],
  exports: [UserToGroupService],
})
export class UserToGroupModule {}
