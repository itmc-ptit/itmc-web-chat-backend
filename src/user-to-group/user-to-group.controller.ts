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
import { UserToGroupService } from './user-to-group.service';
import { CreateUserToGroupDto } from './dto/create-user-to-group.dto';
import { UpdateGroupChatHostDto } from './dto/update-group-chat-host.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/gurads/access-token-auth.guard';
import { UserResponse } from 'src/user/dto/user-response.dto';

@ApiTags('User To Groups')
@UseGuards(AccessTokenGuard)
@Controller('api/v1/user-to-groups')
export class UserToGroupController {
  constructor(private readonly userToGroupService: UserToGroupService) {}

  @Get('groups/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.userToGroupService.findAllByUserId(userId);
  }

  @Get('users/:groupChatId')
  findAllByGroupChatId(@Param('groupChatId') groupChatId: string) {
    return this.userToGroupService.findAllByGroupChatId(groupChatId);
  }

  @Post()
  create(@Body() payload: CreateUserToGroupDto) {
    return this.userToGroupService.create(payload);
  }

  @Get(':id')
  findbyId(@Param('id') id: string) {
    const usertoGroup = this.userToGroupService.findById(id);
    if (!usertoGroup) {
      throw new BadRequestException('User to Group not found');
    }
    return usertoGroup;
  }

  @Patch()
  update(@Req() req: any, @Body() payload: UpdateGroupChatHostDto) {
    const user: UserResponse = req.user;
    return this.userToGroupService.updateGroupChatHost(user._id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userToGroupService.remove(id);
  }
}
