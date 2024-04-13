import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty({ default: Date.now })
  create_at: Date;

  @ApiProperty({ default: null })
  delete_at: Date;

  @ApiProperty({ default: Date.now })
  update_at: Date;

  @ApiProperty({ default: null })
  refresh_token: string;
}
