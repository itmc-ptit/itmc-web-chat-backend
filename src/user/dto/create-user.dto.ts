import { OmitType } from '@nestjs/mapped-types';
import { User } from '../user.model';

export class CreateUserDto extends OmitType(User, [
  'username',
  'refreshToken',
]) {}
