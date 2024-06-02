import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { InvitationModule } from 'src/invitation/invitation.module';
import { NotificationGateway } from './notification-server.gateway';
import { NotificationGatewayService } from './notification-server.service';

@Module({
  imports: [
    UserModule,
    InvitationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [NotificationGatewayService, NotificationGateway],
})
export class NotificationServerModule {}
