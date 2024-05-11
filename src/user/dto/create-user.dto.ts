import { IsDate, IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Expose } from 'class-transformer';
import { IsValidGender } from 'src/user/validator/gender.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'The email of the user',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: 'The first name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'first_name' })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'The last name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'last_name' })
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'User gender, either male or female',
  })
  @IsNotEmpty()
  @IsValidGender()
  gender: string;

  @ApiProperty({
    type: Date,
    description: 'The date of birth of the user',
  })
  @IsDate()
  @IsNotEmpty()
  @Expose({ name: 'date_of_birth' })
  dateOfBirth: string;
}
