import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ default: Date.now })
  create_at: Date;

  @Prop({ default: null })
  delete_at: Date;

  @Prop({ default: Date.now })
  update_at: Date;

  @Prop({ default: null })
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
