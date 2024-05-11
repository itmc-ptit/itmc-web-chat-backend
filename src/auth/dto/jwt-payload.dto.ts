import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JwtPayload {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
