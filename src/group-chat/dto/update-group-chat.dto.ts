import { OmitType } from '@nestjs/mapped-types';
import { CreateGroupChatDto } from './create-group-chat.dto';

export class UpdateGroupChatDto extends OmitType(CreateGroupChatDto, [
  'hostId',
]) {}
