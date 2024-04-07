import { PartialType } from '@nestjs/swagger';
import { CreateChatBanDto } from './create-chat-ban.dto';

export class UpdateChatBanDto extends PartialType(CreateChatBanDto) {}
