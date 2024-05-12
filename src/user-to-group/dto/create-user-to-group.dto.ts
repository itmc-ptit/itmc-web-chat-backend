import { IsString } from '@nestjs/class-validator';
import { IsNotEmpty } from 'class-validator';
import { IsValidRole } from '../validator/role.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserToGroupDto {
  @ApiProperty({
    type: String,
    description: 'The id of the user',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: String,
    description: 'The id of the group chat',
  })
  @IsString()
  @IsNotEmpty()
  groupChatId: string;

  @ApiProperty({
    type: String,
    description: 'The role of the user in the group chat',
  })
  @IsNotEmpty()
  @IsString()
  @IsValidRole()
  role: string;
}
