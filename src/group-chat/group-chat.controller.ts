import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/group-chats')
@ApiTags('Group Chats')
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}

  @Post()
  create(@Body() createGroupChatDto: CreateGroupChatDto) {
    return this.groupChatService.create(createGroupChatDto);
  }

  @Get()
  findAll() {
    return this.groupChatService.findAll();
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    console.log(name);
    return this.groupChatService.findByName(name);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.groupChatService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateGroupChatDto) {
    return this.groupChatService.update(id, {
      ...body,
      updateAt: new Date(),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupChatService.remove(id);
  }
}
