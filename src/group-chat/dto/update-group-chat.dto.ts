import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupChatDto {
  @ApiProperty({
    type: String,
    description: 'The name of the group chat',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'The description of the group chat',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    description: 'The user id of the host of the group chat.',
  })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'host_id' })
  hostId: string;
}
