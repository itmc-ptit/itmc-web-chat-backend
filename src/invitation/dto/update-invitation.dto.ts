import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateInvitationDto {
  @ApiProperty({
    description: 'The id of the invitation',
    type: String,
    example: '60f7d3c3b3e1f4e5c7d2a6c5',
  })
  @IsString()
  @IsNotEmpty()
  invitaionId: string;

  @ApiProperty({
    description: 'The status of the invitation',
    type: String,
    example: 'pending/accepted/rejected',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'The reason why the user is invited to the group chat',
    type: String,
    example: 'You are invited to the group chat',
  })
  @IsString()
  inviteReason: string;

  @ApiProperty({
    description: 'The reason why the invitation is denied',
    type: String,
    example: 'You are not allowed to join the group chat',
  })
  @IsString()
  denyReason: string;
}
