import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, isString } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'User id',
    example: '60f8e5b5d9f0e3b9d4a5c2b0',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'User status',
    example: 'active/inactive',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}
