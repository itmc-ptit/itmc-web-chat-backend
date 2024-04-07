import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatBanService } from './chat-ban.service';
import { CreateChatBanDto } from './dto/create-chat-ban.dto';
import { UpdateChatBanDto } from './dto/update-chat-ban.dto';

@Controller('api/v1/chat-bans')
export class ChatBanController {
  constructor(private readonly chatBanService: ChatBanService) {}

  @Post()
  create(@Body() body: any) {
    const createChatBanDto: CreateChatBanDto = {
      userId: body.user_id,
      charId: body.char_id,
      bannedBy: body.banned_by,
      banReason: body.ban_reason,
    }
    return this.chatBanService.create(createChatBanDto);
  }

  @Get()
  findAll() {
    return this.chatBanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatBanService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const updateChatBanDto: UpdateChatBanDto = {
      endAt: body.end_at,
    }
    return this.chatBanService.update(id, updateChatBanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatBanService.remove(id);
  }
}
