import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { JwtUsage, Tokens } from 'src/helper/jwt.usage';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtUsage: JwtUsage,
  ) {}

  async userRegistration(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.userService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashData(createUserDto.password);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens: Tokens = await this.jwtUsage.generateTokens({
      id: newUser._id,
      email: newUser.email,
    });
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async userAuthentication(data: AuthDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const tokens: Tokens = await this.jwtUsage.generateTokens({
      id: user._id,
      email: user.email,
    });
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  // ! Logout is not implemented in this project
  // async logout(userId: string) {
  //   const user = await this.usersService.findById(userId);
  //   return this.usersService.update(userId, {
  //     first_name: (await user).first_name,
  //     last_name: (await user).last_name,
  //     gender: (await user).gender,
  //     dob: (await user).dob,
  //     refresh_token: null,
  //     update_at: user.update_at,
  //     delete_at: user.delete_at,
  //   });
  // }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      ...user,
      refreshToken: hashedRefreshToken,
    });
  }
}
