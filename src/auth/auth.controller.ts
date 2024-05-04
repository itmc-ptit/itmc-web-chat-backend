import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './gurads/local.guard';

@Controller('api/v1/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() payload: CreateUserDto) {
    return this.authService.register(payload);
  }

  @Post('signin')
  @UseGuards(LocalGuard)
  signin(@Req() req: any) {
    return req.user;
  }
}
