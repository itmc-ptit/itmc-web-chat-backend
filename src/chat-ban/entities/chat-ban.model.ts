import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GroupChat } from 'src/group-chat/entities/group-chat.model';
import { BaseEntity } from 'src/helper/base-entity.model';
import { User } from 'src/user/entities/user.model';

export type ChatBanDocument = ChatBan & Document;

@Schema()
export class ChatBan extends PartialType(BaseEntity) {
  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  @Expose({ name: 'user_id' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: GroupChat.name,
  })
  @Expose({ name: 'group_chat_id' })
  groupChatId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  @Expose({ name: 'banned_by' })
  bannedBy: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  @Expose({ name: 'ban_reason' })
  banReason: string;

  @IsDate()
  @Prop({ required: true })
  @Expose({ name: 'start_at' })
  startAt: Date;

  @IsDate()
  @Prop()
  @Expose({ name: 'end_at' })
  endAt: Date;
}

export const ChatBanSchema = SchemaFactory.createForClass(ChatBan);

ChatBanSchema.index(
  { userId: 1, groupChatId: 1, startAt: 1 },
  { unique: true },
);
