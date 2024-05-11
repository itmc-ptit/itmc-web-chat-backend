import { IsString } from '@nestjs/class-validator';
import { IsNotEmpty } from 'class-validator';
import { IsValidRole } from '../validator/role.validator';
import { IsValidUserToGroupStatus } from '../validator/user-to-group-status.validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserToGroupDto {
  @ApiProperty({
    type: String,
    description: 'The role of the user in the group chat',
  })
  @IsNotEmpty()
  @IsString()
  @IsValidRole()
  role: string;

  @ApiProperty({
    type: String,
    description: 'The status of the user in the group chat',
  })
  @IsNotEmpty()
  @IsString()
  @IsValidUserToGroupStatus()
  status: string;
}
