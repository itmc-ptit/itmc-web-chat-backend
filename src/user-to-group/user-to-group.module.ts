import { Module, forwardRef } from '@nestjs/common';
import { UserToGroupService } from './user-to-group.service';
import { UserToGroupController } from './user-to-group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToGroup, UserToGroupSchema } from './entities/user-to-group.model';
import { GroupChatModule } from 'src/group-chat/group-chat.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    GroupChatModule,
    MongooseModule.forFeature([
      {
        name: UserToGroup.name,
        schema: UserToGroupSchema,
        collection: 'user_to_groups',
      },
    ]),
    UserModule,
  ],
  exports: [UserToGroupService],
  providers: [UserToGroupService],
  controllers: [UserToGroupController],
})
export class UserToGroupModule {}
