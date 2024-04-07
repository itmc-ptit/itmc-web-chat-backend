import { Module } from '@nestjs/common';
import { UserToGroupService } from './user-to-group.service';
import { UserToGroupController } from './user-to-group.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToGroupSchema } from './entities/user-to-group.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user_to_groups', schema: UserToGroupSchema }])],
  controllers: [UserToGroupController],
  providers: [UserToGroupService],
})
export class UserToGroupModule {}
