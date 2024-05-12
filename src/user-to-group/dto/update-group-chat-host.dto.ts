import { IsString } from '@nestjs/class-validator';
import { IsNotEmpty } from 'class-validator';
import { IsValidRole } from '../validator/role.validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupChatHostDto {
  @ApiProperty({
    type: String,
    description: 'The user to group id',
  })
  @IsNotEmpty()
  @IsString()
  groupChatId: string;

  @ApiProperty({
    type: String,
    description: 'The new host id',
  })
  @IsNotEmpty()
  @IsString()
  newHostId: string;
}
