import { BaseEntity } from 'src/helper/base-entity.model';
import { User } from 'src/user/entities/user.model';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GroupChat } from 'src/group-chat/entities/group-chat.model';
import { InvitationStatus } from './invitation-status.enum';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidInvitationStatus } from '../validators/invitation-status.validator';
import { Expose } from 'class-transformer';

export type InvitationDocument = Invitation & Document;

@Schema()
export class Invitation extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  @Expose({ name: 'inviter_id' })
  inviterId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  @Expose({ name: 'recipient_id' })
  recipientId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: GroupChat.name,
  })
  @Expose({ name: 'group_chat_id' })
  groupChatId: string;

  @IsValidInvitationStatus()
  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  status: InvitationStatus;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  @Expose({ name: 'invite_reason' })
  inviteReason: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: false,
  })
  @Expose({ name: 'deny_reason' })
  denyReason: string;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

InvitationSchema.index(
  {
    inviterId: 1,
    recipientId: 1,
    groupChatId: 1,
  },
  { unique: true },
);
