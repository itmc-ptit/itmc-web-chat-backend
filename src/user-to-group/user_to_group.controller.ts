import { Controller, Post, Param, Body } from '@nestjs/common';
import { UserToGroupService } from './user_to_group.service';
import { CreateUserToGroupDto } from './dto/create_user_to_group.dto';
import { UserToGroup } from './user_to_group.interface';

@Controller('user-to-group')
export class UserToGroupController {
  constructor(private readonly userToGroupService: UserToGroupService) {}

  @Post(':chat_id/:user_id')
  async create(
    @Param('chat_id') chatId: string, 
    @Param('user_id') userId: string, 
    @Body() createUserToGroupDto: CreateUserToGroupDto
  ): Promise<UserToGroup> {
    return this.userToGroupService.create({
      chat_id: chatId,
      user_id: userId,
      ...createUserToGroupDto
    });
  }
}
