import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UUID } from 'sequelize';

export class UpdateGroupChatDto {
  @ApiProperty({
    type: String,
    description: 'The group chat id',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
    description: 'The group chat id',
  })
  @IsNotEmpty()
  @IsString()
  groupChatId: string;

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
