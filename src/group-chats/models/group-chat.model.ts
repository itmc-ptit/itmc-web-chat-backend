import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupChatDocument = GroupChat & Document;

@Schema()
export class GroupChat {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: false })
  description: string;

  @Prop({ required: true, unique: false })
  host_id: string;

  @Prop({ required: true, unique: false })
  create_at: Date;

  @Prop({ required: false, unique: false })
  delete_at: Date;

  @Prop({ required: true, unique: false })
  update_at: Date;
}

export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);
