import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToGroupController } from './user_to_group.controller';
import { UserToGroupService } from './user_to_group.service';
import { UserToGroupSchema } from '../models/user_to_group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'UserToGroup', schema: UserToGroupSchema }]),
  ],
  controllers: [UserToGroupController],
  providers: [UserToGroupService],
})
export class UserToGroupModule {}
