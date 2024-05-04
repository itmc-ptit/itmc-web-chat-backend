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
import { ChatHistoryService } from './chat-history.service';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/gurads/access-token-auth.guard';

@UseGuards(AccessTokenGuard)
@Controller('api/v1/chat-histories')
@ApiTags('Chat Histories')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @Post()
  create(@Body() body: CreateChatHistoryDto) {
    return this.chatHistoryService.create(body);
  }

  @Get('chat/:groupChatId')
  findByChatId(@Param('groupChatId') groupChatId: string) {
    return this.chatHistoryService.findAllByChatId(groupChatId);
  }

  @Get()
  findAll() {
    return this.chatHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const chatHistory = this.chatHistoryService.findById(id);
    if (!chatHistory) {
      throw new BadRequestException('Chat history not found');
    }

    return chatHistory;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateChatHistoryDto) {
    return this.chatHistoryService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatHistoryService.remove(id);
  }
}
