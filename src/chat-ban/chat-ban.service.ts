import { Injectable } from '@nestjs/common';
import { CreateChatBanDto } from './dto/create-chat-ban.dto';
import { UpdateChatBanDto } from './dto/update-chat-ban.dto';

@Injectable()
export class ChatBanService {
  create(createChatBanDto: CreateChatBanDto) {
    return 'This action adds a new chatBan';
  }

  findAll() {
    return `This action returns all chatBan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatBan`;
  }

  update(id: number, updateChatBanDto: UpdateChatBanDto) {
    return `This action updates a #${id} chatBan`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatBan`;
  }
}
