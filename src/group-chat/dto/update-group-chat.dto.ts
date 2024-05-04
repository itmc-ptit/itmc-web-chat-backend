import { OmitType } from '@nestjs/mapped-types';
import { GroupChat } from '../entities/group-chat.model';

export class UpdateGroupChatDto extends OmitType(GroupChat, ['hostId']) {}
