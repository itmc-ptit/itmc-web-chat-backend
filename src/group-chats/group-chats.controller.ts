import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupChatsService } from './group-chats.service';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';

@Controller('api/v1/group-chats')
export class GroupChatsController {
  constructor(private readonly groupChatsService: GroupChatsService) {}

  @Post()
  create(@Body() createGroupChatDto: CreateGroupChatDto) {
    return this.groupChatsService.create(createGroupChatDto);
  }

  @Get()
  findAll() {
    return this.groupChatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupChatsService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupChatDto: UpdateGroupChatDto) {
    return this.groupChatsService.update(+id, updateGroupChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupChatsService.remove(+id);
  }
}
