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
import { Request } from 'express';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    const user = this.userService.findById(req.user.sub);
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
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const token: string = this.getTokenFromHeader(req);
    return this.userService.update(token, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  private getTokenFromHeader(req: Request): string {
    const authHeader = req.headers.authorization;
    const token: string = authHeader.split(' ')[1];
    return token;
  }
}
