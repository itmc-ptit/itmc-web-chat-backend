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
    type: Number,
    description: 'Number of messages to fetch',
  })
  @IsNotEmpty()
  @Min(10)
  limit: number;

  @ApiProperty({
    type: Number,
    description: 'Page number',
  })
  @IsNotEmpty()
  @Min(0)
  page: number;
}
