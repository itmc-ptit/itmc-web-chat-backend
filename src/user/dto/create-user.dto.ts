import { OmitType } from '@nestjs/mapped-types';
import { User } from '../entities/user.model';

export class CreateUserDto extends OmitType(User, [
  'username',
  'refreshToken',
]) {}
