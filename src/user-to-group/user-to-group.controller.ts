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
import { UserToGroupService } from './user-to-group.service';
import { CreateUserToGroupDto } from './dto/create-user-to-group.dto';
import { UpdateUserToGroupDto } from './dto/update-user-to-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/gurads/access-token-auth.guard';

@ApiTags('User To Groups')
@UseGuards(AccessTokenGuard)
@Controller('api/v1/user-to-groups')
export class UserToGroupController {
  constructor(private readonly userToGroupService: UserToGroupService) {}

  @Get('groups/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.userToGroupService.findAllByUserId(userId);
  }

  @Get('users/:groupId')
  findAllByGroupId(@Param('groupId') groupId: string) {
    return this.userToGroupService.findAllByGroupId(groupId);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateUserToGroupDto) {
    return this.userToGroupService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userToGroupService.remove(id);
  }
}
