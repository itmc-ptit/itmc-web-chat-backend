import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { InvitationStatus } from './invitation-status.enum';

export type GroupInvitationDocument = GroupInvitation & Document;

@Schema()
export class GroupInvitation {
  @Prop({ type: String, required: true, ref: 'GroupChat' })
  group_id: string;

  @Prop({ type: String, required: true, ref: 'User' })
  inviter_id: string;

  @Prop({ type: String, required: true, ref: 'User' })
  invitee_id: string;

  @Prop({ type: String, enum: Object.values(InvitationStatus), default: InvitationStatus.IN_PROGRESS })
  status: InvitationStatus;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop({ type: Date, default: null })
  deleted_at: Date;
}

export const GroupInvitationSchema = SchemaFactory.createForClass(GroupInvitation);