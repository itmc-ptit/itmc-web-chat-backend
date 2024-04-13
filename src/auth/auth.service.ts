import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // * Check if user exists
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // * Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
      create_at: new Date(),
      delete_at: null,
      update_at: new Date(),
    });

    // * Generate tokens
    const tokens = await this.getTokens(newUser._id, newUser.email);
    await this.updateRefreshToken(newUser._id, tokens.refresh_token);
    return tokens;
  }

  async signIn(data: AuthDto) {
    // * Check if user exists
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('User does not exist');

    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new UnauthorizedException('Password is incorrect');

    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    const user = await this.usersService.findById(userId);
    return this.usersService.update(userId, {
      first_name: (await user).first_name,
      last_name: (await user).last_name,
      gender: (await user).gender,
      dob: (await user).dob,
      refresh_token: null,
      update_at: user.update_at,
      delete_at: user.delete_at,
    });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      first_name: user.first_name,
      last_name: user.last_name,
      dob: user.dob,
      gender: user.gender,
      update_at: new Date(),
      delete_at: user.delete_at,
      refresh_token: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      jwt: accessToken,
      refresh_token: refreshToken,
    };
  }

  decodeToken(token: string) {
    try {
      const decodedToken = this.jwtService.decode(token) as any;
      if (decodedToken) {
        return decodedToken; // This will contain the payload (claims) of the token
      }
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
