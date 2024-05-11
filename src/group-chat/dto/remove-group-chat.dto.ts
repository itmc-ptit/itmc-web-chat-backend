import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveGroupChatDto {
  @ApiProperty({
    type: String,
    description: 'The id of the group chat to be removed',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
