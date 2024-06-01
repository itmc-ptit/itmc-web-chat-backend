import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatHistoryModule } from 'src/chat-history/chat-history.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { InvitationModule } from 'src/invitation/invitation.module';

@Module({
  imports: [
    ChatHistoryModule,
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
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
