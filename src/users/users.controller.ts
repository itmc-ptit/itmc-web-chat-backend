import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async createUser(
    @Body('password') password: string,
    @Body('email') email: string,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('gender') gender: string,
    @Body('dob') dob: string,
  ): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const result = await this.usersService.createUser(
      email,
      hashedPassword,
      first_name,
      last_name,
      gender,
      new Date(dob),
    );
    return result;
  }
}
