import { OmitType } from '@nestjs/mapped-types';
import { ChatBan } from '../entities/chat-ban.model';

export class CreateChatBanDto extends OmitType(ChatBan, ['endAt']) {}
