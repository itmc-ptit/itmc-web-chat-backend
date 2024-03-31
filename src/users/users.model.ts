import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// *  The `@Schema` marked the class as a schema for the expecting table in database
@Schema()
export class User {
  // * The `@Prop` marked the variable as a properties of a table
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

  @Prop()
  create_at: Date;

  @Prop()
  delete_at: Date;

  @Prop()
  update_at: Date;

  @Prop()
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
