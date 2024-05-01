import { OmitType } from '@nestjs/mapped-types';
import { UserToGroup } from '../entities/user-to-group.model';

export class UpdateUserToGroupDto extends OmitType(UserToGroup, [
  'userId',
  'groupChatId',
]) {}
