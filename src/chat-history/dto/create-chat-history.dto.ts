import { PartialType } from '@nestjs/mapped-types';
import { ChatHistory } from '../entities/chat-history.model';

export class CreateChatHistoryDto extends PartialType(ChatHistory) {}
