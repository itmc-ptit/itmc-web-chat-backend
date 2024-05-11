import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveUserDto {
  @ApiProperty({
    type: String,
    description: 'The id of the user',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
