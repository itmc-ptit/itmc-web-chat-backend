import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum InvitationStatus {
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class GroupInvitation extends Document {
  @Prop({ required: true })
  group_id: string;

  @Prop({ required: true })
  inviter_id: string;

  @Prop({ required: true })
  invitee_id: string;

  @Prop({ enum: Object.values(InvitationStatus), default: InvitationStatus.IN_PROGRESS })
  status: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop()
  deleted_at: Date;
}

export const GroupInvitationSchema = SchemaFactory.createForClass(GroupInvitation);