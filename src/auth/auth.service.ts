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
import * as jwt from 'jsonwebtoken';
import { UserResponse } from 'src/user/dto/user-response.dto';

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
      throw new BadRequestException('Email has been taken');
    }

    const hashedPassword = await this.hashData(createUserDto.password);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens: Tokens = await this.generateTokens({
      sub: newUser._id,
      email: newUser.email,
    });
    await this.userService.updateRefreshToken(newUser._id, tokens.refreshToken);

    const userResponse: UserResponse = {
      ...newUser.toJSON(),
      accessToken: tokens.accessToken,
    };

    return userResponse;
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
      sub: user._id,
      email: user.email,
    });
    await this.userService.updateRefreshToken(user._id, tokens.refreshToken);

    const userResponse: UserResponse = {
      ...user.toJSON(),
      accessToken: tokens.accessToken,
    };

    return userResponse;
  }

  async validateAccessToken(payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);
    if (!user || user.email !== payload.email) {
      throw new UnauthorizedException('Unauthorized!');
    }

    const accessToken = jwt.sign(
      {
        sub: user._id,
        email: user.email,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: '1h',
      },
    );

    const userResponse: UserResponse = {
      ...user.toJSON(),
      accessToken: accessToken,
    };

    return userResponse;
  }

  async generateTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: jwtPayload.sub,
          email: jwtPayload.email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: jwtPayload.sub,
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
