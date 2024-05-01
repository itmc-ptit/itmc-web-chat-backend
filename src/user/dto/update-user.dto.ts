import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { User } from '../user.model';

export class UpdateUserDto extends OmitType(User, ['email']) {}
