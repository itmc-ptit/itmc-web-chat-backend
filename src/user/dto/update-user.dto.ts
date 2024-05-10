import { IsDate, IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Expose } from 'class-transformer';
import { IsValidGender } from 'src/validators/gender.validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'first_name' })
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'last_name' })
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsValidGender()
  gender: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Expose({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @IsString()
  @Expose({ name: 'refresh_token' })
  refreshToken: string;
}
