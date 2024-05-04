import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ChatBanService } from './chat-ban.service';
import { CreateChatBanDto } from './dto/create-chat-ban.dto';
import { UpdateChatBanDto } from './dto/update-chat-ban.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/gurads/access-token-auth.guard';

@UseGuards(AccessTokenGuard)
@Controller('api/v1/chat-bans')
@ApiTags('Chat Ban')
export class ChatBanController {
  constructor(private readonly chatBanService: ChatBanService) {}

  @Post()
  create(@Body() body: CreateChatBanDto) {
    return this.chatBanService.create(body);
  }

  @Get()
  findAll() {
    return this.chatBanService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const chatBan = this.chatBanService.findById(id);
    if (!chatBan) {
      throw new BadRequestException('Chat ban not found');
    }
    return chatBan;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateChatBanDto) {
    return this.chatBanService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatBanService.remove(id);
  }
}
