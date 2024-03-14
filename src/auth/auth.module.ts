import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from '../strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../strategies/refreshToken.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({}), UserModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
