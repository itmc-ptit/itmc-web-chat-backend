import { OmitType } from '@nestjs/mapped-types';
import { ChatHistory } from '../entities/chat-history.model';

export class UpdateChatHistoryDto extends OmitType(ChatHistory, [
  'userId',
  'groupChatId',
]) {}
