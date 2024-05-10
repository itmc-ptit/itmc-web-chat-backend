import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupChatDto {
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

  @ApiProperty({
    type: String,
    description: 'The user id of the creator of the group chat',
  })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'creator_id' })
  creatorId: string;
}
