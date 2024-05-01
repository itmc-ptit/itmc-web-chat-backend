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
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/user-to-groups')
@ApiTags('User To Groups')
export class UserToGroupController {
  constructor(private readonly userToGroupService: UserToGroupService) {}

  @Get('groups/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.userToGroupService.findByUserId(userId);
  }

  @Post()
  create(@Body() body: CreateUserToGroupDto) {
    return this.userToGroupService.create(body);
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
  update(@Param('id') id: string, @Body() body: UpdateUserToGroupDto) {
    return this.userToGroupService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userToGroupService.remove(id);
  }
}
