import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  gender: string;

  @Prop()
  dob: Date;

  @Prop()
  create_at: Date;

  @Prop()
  delete_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
