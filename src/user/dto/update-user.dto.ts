import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.model';

export class UpdateUserDto extends OmitType(User, [
  'email',
  'refreshToken',
  'username',
]) {}
