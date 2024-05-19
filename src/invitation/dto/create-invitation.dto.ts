import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({
    description: 'The id of the user who sent the invitation',
    type: String,
    example: '60f7d3c3b3e1f4e5c7d2a6c5',
  })
  @IsString()
  @IsNotEmpty()
  inviterId: string;

  @ApiProperty({
    description: 'The id of the user who received the invitation',
    type: String,
    example: '60f7d3c3b3e1f4e5c7d2a6c5',
  })
  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @ApiProperty({
    description: 'The id of the group chat where the invitation is sent',
    type: String,
    example: '60f7d3c3b3e1f4e5c7d2a6c5',
  })
  @IsString()
  @IsNotEmpty()
  groupChatId: string;

  @ApiProperty({
    description: 'The reason why the user is invited to the group chat',
    type: String,
    example: 'You are invited to the group chat',
  })
  @IsString()
  @IsNotEmpty()
  inviteReason: string;

  @ApiProperty({
    description: 'The reason why the invitation is denied',
    type: String,
    example: 'You are not allowed to join the group chat',
  })
  @IsString()
  denyReason: string;
}
