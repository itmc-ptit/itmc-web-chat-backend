import { OmitType } from '@nestjs/mapped-types';
import { ChatBan } from '../entities/chat-ban.model';

export class UpdateChatBanDto extends OmitType(ChatBan, [
  'userId',
  'groupChatId',
  'bannedBy',
]) {}
