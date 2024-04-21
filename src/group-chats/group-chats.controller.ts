import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupChatsService } from './group-chats.service';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/group-chats')
@ApiTags('Group Chats')
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

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    console.log(name);
    return this.groupChatsService.findByName(name);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.groupChatsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const updateGroupChatDto: UpdateGroupChatDto = {
      name: body.name,
      description: body.description,
      updatedAt: body.updated_at,
    };
    return this.groupChatsService.update(id, updateGroupChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupChatsService.remove(id);
  }
}
