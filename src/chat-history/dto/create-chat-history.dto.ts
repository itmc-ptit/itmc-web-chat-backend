import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatHistoryDto {
  @ApiProperty({
    description: 'User id',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Group chat id',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  groupChatId: string;

  @ApiProperty({
    description: 'Message',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Attachment',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  attachment: string;
}
