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
  UnauthorizedException,
} from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/gurads/access-token-auth.guard';
import { Request } from 'express';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { RemoveGroupChatDto } from './dto/remove-group-chat.dto';

// TODO: update the ERD to reflect the new changes.
@UseGuards(AccessTokenGuard)
@Controller('api/v1/group-chats')
@ApiTags('Group Chats')
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}

  @Post()
  create(@Body() payload: CreateGroupChatDto) {
    console.log('create payload:', payload);
    return this.groupChatService.create(payload);
  }

  @Get('host/:hostId')
  findAll(@Req() req: any, @Param('hostId') hostId: string) {
    const user: UserResponse = req.user;
    if (user._id.toString() !== hostId) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return this.groupChatService.findAllByHostId(hostId);
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

  @Patch()
  update(@Req() req: any, @Body() body: UpdateGroupChatDto) {
    const user: UserResponse = req.user;
    return this.groupChatService.update(user._id, body);
  }

  @Delete()
  remove(@Req() req: any, @Body() payload: RemoveGroupChatDto) {
    const user: UserResponse = req.user;
    return this.groupChatService.remove(user._id, payload.id);
  }

  private getTokenFromHeader(req: Request): string {
    const authHeader = req.headers.authorization;
    const token: string = authHeader.split(' ')[1];
    return token;
  }
}
