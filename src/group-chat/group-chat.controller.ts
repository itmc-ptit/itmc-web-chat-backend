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
 * New features:
 * - Introduct new field: creator_id to store the user id of the user who created the group chat. The creator_id is different from the host_id. The creator_id is the user who created the group chat while the host_id is the user who host the group chat. The host_id is the user who is responsible for the group chat. The host_id can be changed, but the creator_id cannot be changed. The host_id can update the group chat, but the creator_id might not be able to do.
 *
 * Current bugs:
 * - The update API allow for updating the group chat even though the claim from access token does not match with the host id. Only the user match the host id is allowed to update the group chat.
 * - The get all group chat API should not allow for finding all group chats. It should only allow for finding group chats that the user is a member of.
 *
 * TODO: Add the logic to verify the api sender is the valid host or not.
 * TODO: Implement the creator_id login to the API service.
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
