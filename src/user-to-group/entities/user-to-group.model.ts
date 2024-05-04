import { IsString } from '@nestjs/class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GroupChat } from 'src/group-chat/entities/group-chat.model';
import { BaseEntity } from 'src/helper/base-entity.model';
import { User } from 'src/user/entities/user.model';
import { IsValidRole } from 'src/validators/role.validator';
import { IsValidUserToGroupStatus } from 'src/validators/user-to-group-status.validator';

export type UserToGroupDocument = UserToGroup & Document;

@Schema()
export class UserToGroup extends PartialType(BaseEntity) {
  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: GroupChat.name,
  })
  groupChatId: string;

  @IsValidRole()
  @Prop({ required: true })
  role: string;

  @Prop({ required: false })
  isBlocked: boolean;

  @IsValidUserToGroupStatus()
  @Prop({ required: false })
  status: string;
}

export const UserToGroupSchema = SchemaFactory.createForClass(UserToGroup);

UserToGroupSchema.index({ userId: 1, chatId: 1 }, { unique: true });
