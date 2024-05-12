import { IsString } from '@nestjs/class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GroupChat } from 'src/group-chat/entities/group-chat.model';
import { BaseEntity } from 'src/helper/base-entity.model';
import { User } from 'src/user/entities/user.model';
import { IsValidRole } from '../validator/role.validator';
import { MemberRole } from './member-role.enum';

export type UserToGroupDocument = UserToGroup & Document;

@Schema()
export class UserToGroup extends BaseEntity {
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
  role: MemberRole;

  @Prop({ required: false })
  isBlocked: boolean;
}

export const UserToGroupSchema = SchemaFactory.createForClass(UserToGroup);

UserToGroupSchema.index({ userId: 1, chatId: 1 }, { unique: true });
