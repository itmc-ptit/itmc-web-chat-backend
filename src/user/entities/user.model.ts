import { IsDate, IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/helper/base-entity.model';
import { IsValidGender } from 'src/user/validator/gender.validator';
import { Gender } from './gender.enum';

export type UserDocument = User & Document;

@Schema()
export class User extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Prop({ required: true, unique: false })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  @Expose({ name: 'first_name' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  @Expose({ name: 'last_name' })
  lastName: string;

  @Prop({ required: false, unique: true, default: null })
  username: string;

  @IsNotEmpty()
  @IsValidGender()
  @Prop({ required: true })
  gender: Gender;

  @IsDate()
  @IsNotEmpty()
  @Prop({ required: true })
  @Expose({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @IsString()
  @Prop({ required: false })
  @Expose({ name: 'refresh_token' })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
