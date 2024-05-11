import { IsDate, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Expose } from 'class-transformer';
import { IsValidGender } from 'src/user/validator/gender.validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'The updating user id',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user',
  })
  @IsString({})
  password: string;

  @ApiProperty({
    type: String,
    description: 'The first name of the user',
  })
  @IsString()
  @Expose({ name: 'first_name' })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'The last name of the user',
  })
  @IsString()
  @Expose({ name: 'last_name' })
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'The user gender, either male or female',
  })
  @IsValidGender()
  gender: string;

  @ApiProperty({
    type: Date,
    description: 'The date of birth of the user',
  })
  @IsDate()
  @Expose({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @IsString()
  @Expose({ name: 'refresh_token' })
  refreshToken: string;
}
