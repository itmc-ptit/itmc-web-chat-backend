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
  Req,
} from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/gurads/access-token-auth.guard';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { FetchChatHistoryDto } from './dto/fetch-chat-history.dto';
import { ChatHistoryDocument } from './entities/chat-history.model';

@UseGuards(AccessTokenGuard)
@Controller('api/v1/chat-histories')
@ApiTags('Chat Histories')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @Post()
  create(@Body() payload: CreateChatHistoryDto) {
    return this.chatHistoryService.create(payload);
  }

  @Get('messages')
  findAllByGroupChatId(
    @Body() payload: FetchChatHistoryDto,
  ): Promise<ChatHistoryDocument[]> {
    return this.chatHistoryService.findAllByGroupChatId(payload);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const chatHistory = this.chatHistoryService.findById(id);
    if (!chatHistory) {
      throw new BadRequestException('Chat history not found');
    }

    return chatHistory;
  }

  @Patch()
  update(@Req() req: any, @Body() payload: UpdateChatHistoryDto) {
    const user: UserResponse = req.user;
    return this.chatHistoryService.update(user._id.toString(), payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatHistoryService.remove(id);
  }
}
