import { Min } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FetchChatHistoryDto {
  @ApiProperty({
    type: String,
    description: 'Group chat id',
  })
  @IsNotEmpty()
  @IsString()
  groupChatId: string;

  @ApiProperty({
    type: String,
    description:
      'Timestamp of the oldest message in the chat history. Format: YYYY-MM-DDTHH:mm:ss.sssZ',
  })
  @IsString()
  timestamp: string;

  @ApiProperty({
    type: Number,
    description: 'Number of messages to fetch',
  })
  @IsNotEmpty()
  @Min(10)
  limit: number;
}
