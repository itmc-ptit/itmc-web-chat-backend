import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChatHistoryDto {
  @ApiProperty({
    description: 'Message id',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  chatHistoryId: string;

  @ApiProperty({
    description: 'Message',
    type: String,
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Attachment',
    type: String,
  })
  @IsString()
  attachment: string;
}
