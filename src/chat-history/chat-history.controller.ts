import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/chat-histories')
@ApiTags('Chat Histories')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @Get('chat/:chat_id')
  findByChatId(@Param('chat_id') chatId: string) {
    return this.chatHistoryService.findAllByChatId(chatId);
  }

  @Post()
  create(@Body() body: any) {
    const createChatHistoryDto: CreateChatHistoryDto = {
      userId: body.user_id,
      chatId: body.chat_id,
      message: body.message,
      attachment: body.attachment,
    };
    return this.chatHistoryService.create(createChatHistoryDto);
  }

  @Get()
  findAll() {
    return this.chatHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatHistoryService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const updateChatHistoryDto: UpdateChatHistoryDto = {
      message: body.message,
      attachment: body.attachment,
    };
    return this.chatHistoryService.update(id, updateChatHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatHistoryService.remove(id);
  }
}
