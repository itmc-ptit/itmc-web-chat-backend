import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserToGroupService } from './user-to-group.service';
import { CreateUserToGroupDto } from './dto/create-user-to-group.dto';
import { UpdateUserToGroupDto } from './dto/update-user-to-group.dto';

@Controller('api/v1/user-to-groups')
export class UserToGroupController {
  constructor(private readonly userToGroupService: UserToGroupService) {}

  @Get('groups/')
  findByUserId(@Param('id') userId: string) {
    console.log('log:', userId);
    return this.userToGroupService.findByUserId(userId);
  }

  @Post()
  create(@Body() body: any) {
    const createUserToGroupDto: CreateUserToGroupDto = {
      userId: body.user_id,
      chatId: body.chat_id,
      role: body.role,
    };
    return this.userToGroupService.create(createUserToGroupDto);
  }

  @Get()
  findAll() {
    return this.userToGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userToGroupService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const updateUserToGroupDto: UpdateUserToGroupDto = {
      role: body.role,
      isBlocked: body.is_blocked,
    };
    return this.userToGroupService.update(id, updateUserToGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userToGroupService.remove(id);
  }
}
