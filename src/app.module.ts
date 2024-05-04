import {
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { GroupChatModule } from './group-chat/group-chat.module';
import { ChatHistoryModule } from './chat-history/chat-history.module';
import { ChatBanModule } from './chat-ban/chat-ban.module';
import { UserToGroupModule } from './user-to-group/user-to-group.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EntityResponseInterceptor } from './interceptors/entity-response.interceptor';
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.DB_CONNECTION_STRING}`),
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    ChatModule,
    GroupChatModule,
    ChatHistoryModule,
    ChatBanModule,
    UserToGroupModule,
  ],
  providers: [
    Logger,
    { provide: APP_INTERCEPTOR, useClass: EntityResponseInterceptor },
  ],
  controllers: [],
})
export class AppModule {}
