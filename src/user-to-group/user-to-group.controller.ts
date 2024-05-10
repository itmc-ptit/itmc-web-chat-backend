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

@UseGuards(AccessTokenGuard)
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    const usertoGroup = this.userToGroupService.findById(id);
    if (!usertoGroup) {
      throw new BadRequestException('User to Group not found');
    }
    return usertoGroup;
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
