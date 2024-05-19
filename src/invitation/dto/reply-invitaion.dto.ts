import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidInvitationStatus } from '../validators/invitation-status.validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplyInvitationDto {
  @ApiProperty({
    description: 'Invitation ID',
    example: '60f9b6a0e6f6b4e8b5d7c1a3',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  invitationId: string;

  @ApiProperty({
    description: 'Invitation status',
    example: 'accepted/rejected',
    type: String,
  })
  @IsValidInvitationStatus()
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Deny reason',
    type: String,
  })
  @IsString()
  denyReason: string;
}
