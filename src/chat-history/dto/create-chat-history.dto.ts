import { ApiProperty } from '@nestjs/swagger';

export class CreateChatHistoryDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  groupChatId: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  attachment: string;
}
