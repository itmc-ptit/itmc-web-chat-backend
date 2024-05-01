import { OmitType } from '@nestjs/mapped-types';
import { UserToGroup } from '../entities/user-to-group.model';

export class CreateUserToGroupDto extends OmitType(UserToGroup, [
  'isBlocked',
  'status',
]) {}
