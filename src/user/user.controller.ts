import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtUsage } from 'src/helper/jwt.usage';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtUsage: JwtUsage,
  ) {}

  @Get('me')
  decodeToken(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1]; // Extract token from Authorization header
    const decodedToken = this.jwtUsage.decodeToken(token);
    const user = this.userService.findById(decodedToken.sub);
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
