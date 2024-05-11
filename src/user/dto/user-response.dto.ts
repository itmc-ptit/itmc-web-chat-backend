import { IsDate, IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Expose } from 'class-transformer';
import { BaseEntity } from 'src/helper/base-entity.model';
import { IsValidGender } from 'src/user/validator/gender.validator';

export class UserResponse extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'first_name' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'last_name' })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsValidGender()
  gender: string;

  @IsDate()
  @IsNotEmpty()
  @Expose({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @IsString()
  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  @IsString()
  @Expose({ name: 'access_token' })
  accessToken: string;
}
