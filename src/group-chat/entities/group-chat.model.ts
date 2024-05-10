import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BaseEntity } from 'src/helper/base-entity.model';
import { User } from 'src/user/entities/user.model';

export type GroupChatDocument = GroupChat & Document;

@Schema()
export class GroupChat extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: true })
  name: string;

  @IsString()
  @Prop({ required: true, unique: false })
  description: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    unique: false,
  })
  @Expose({ name: 'host_id' })
  hostId: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    unique: false,
  })
  @Expose({ name: 'creator_id' })
  creatorId: string;
}

export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);
