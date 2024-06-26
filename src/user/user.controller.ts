import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/gurads/access-token-auth.guard';
import { UserResponse } from './dto/user-response.dto';
import { RemoveUserDto } from './dto/remove-user.dto';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    const user: UserResponse = req.user;
    return user;
  }

  @Get('/username/:username')
  findByUsername(@Param('username') username: string) {
    console.log('username', username);
    const user = this.userService.findByUsername(username);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    const user = this.userService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  update(@Req() req: any, @Body() payload: UpdateUserDto) {
    const user: UserResponse = req.user;
    return this.userService.update(user._id.toString(), payload);
  }

  @UseGuards(AccessTokenGuard)
  @Delete()
  remove(@Body() payload: RemoveUserDto) {
    return this.userService.remove(payload);
  }
}
