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

  @ApiProperty()
  create_at: Date;

  @ApiProperty()
  delete_at: Date;

  @ApiProperty()
  update_at: Date;

  @ApiProperty()
  refresh_token: string;
}
