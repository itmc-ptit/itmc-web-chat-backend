import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatBanService } from './chat-ban.service';
import { CreateChatBanDto } from './dto/create-chat-ban.dto';
import { UpdateChatBanDto } from './dto/update-chat-ban.dto';

@Controller('chat-ban')
export class ChatBanController {
  constructor(private readonly chatBanService: ChatBanService) {}

  @Post()
  create(@Body() createChatBanDto: CreateChatBanDto) {
    return this.chatBanService.create(createChatBanDto);
  }

  @Get()
  findAll() {
    return this.chatBanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatBanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatBanDto: UpdateChatBanDto) {
    return this.chatBanService.update(+id, updateChatBanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatBanService.remove(+id);
  }
}
