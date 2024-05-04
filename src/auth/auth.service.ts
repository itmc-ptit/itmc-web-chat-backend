import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { UserAuthenticationPayload } from './dto/user-authentication-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.dto';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashData(createUserDto.password);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens: Tokens = await this.generateTokens({
      id: newUser._id,
      email: newUser.email,
    });
    await this.userService.updateRefreshToken(newUser._id, tokens.refreshToken);

    return {
      ...newUser.toJSON(),
      jwt: tokens.accessToken,
    };
  }

  async validateUser({ email, password }: UserAuthenticationPayload) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const passwordMatches = await argon2.verify(user.password, password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const tokens: Tokens = await this.generateTokens({
      id: user._id,
      email: user.email,
    });
    await this.userService.updateRefreshToken(user._id, tokens.refreshToken);

    return {
      ...user.toJSON(),
      jwt: tokens.accessToken,
    };
  }

  async generateTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: jwtPayload.id,
          email: jwtPayload.email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: jwtPayload.id,
          email: jwtPayload.email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
