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
import { GroupChatService } from './group-chat.service';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/gurads/access-token-auth.guard';

/**
 * Group Chat Controller
 *
 * Current bugs:
 * - The update API allow for updating the group chat even though the claim from access token does not match with the host id. Only the user match the host id is allowed to update the group chat.
 *
 * TODO: Fix the bug by adding a guard to check if the user match the host id before updating the group chat.
 */
@UseGuards(AccessTokenGuard)
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
    const groupChat = this.groupChatService.findByName(name);
    if (!groupChat) {
      throw new BadRequestException('Group chat not found');
    }
    return groupChat;
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const groupChat = this.groupChatService.findById(id);
    if (!groupChat) {
      throw new BadRequestException('Group chat not found');
    }
    return groupChat;
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
