import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GroupChat } from 'src/group-chat/entities/group-chat.model';
import { BaseEntity } from 'src/helper/base-entity.model';
import { User } from 'src/user/entities/user.model';

export type ChatHistoryDocument = ChatHistory & Document;

@Schema()
export class ChatHistory extends BaseEntity {
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

ChatHistorySchema.index({ createAt: -1 });

ChatHistorySchema.index(
  {
    userId: 1,
    groupChatId: 1,
    createAt: 1,
  },
  { unique: true },
);
