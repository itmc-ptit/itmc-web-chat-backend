import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserToGroupDocument = UserToGroup & Document;

@Schema()
export class UserToGroup {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  userId: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'GroupChat',
  })
  chatId: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  isBlocked: boolean;

  @Prop({ required: true })
  joinedAt: Date;
}

export const UserToGroupSchema = SchemaFactory.createForClass(UserToGroup);

// Define compound index for userId and chatId
UserToGroupSchema.index({ userId: 1, chatId: 1 }, { unique: true });
