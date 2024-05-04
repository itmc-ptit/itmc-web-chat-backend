import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GroupChat } from 'src/group-chat/entities/group-chat.model';
import { BaseEntity } from 'src/helper/base-entity.model';
import { User } from 'src/user/entities/user.model';

export type ChatHistoryDocument = ChatHistory & Document;

@Schema()
export class ChatHistory extends PartialType(BaseEntity) {
  @IsString()
  @IsNotEmpty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: GroupChat.name,
    required: true,
  })
  groupChatId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  message: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: false })
  attachment: string;
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);

ChatHistorySchema.index(
  {
    userId: 1,
    groupChatId: 1,
    createdAt: 1,
  },
  { unique: true },
);
