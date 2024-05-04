import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/helper/base-entity.model';

export type GroupChatDocument = GroupChat & Document;

@Schema()
export class GroupChat extends PartialType(BaseEntity) {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: true })
  name: string;

  @IsString()
  @Prop({ required: true, unique: false })
  description: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: false })
  @Expose({ name: 'host_id' })
  hostId: string;
}

export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);
