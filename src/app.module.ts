import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { GroupChatsModule } from './group-chats/group-chats.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/itmc-web-chat'),
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    ChatModule,
    GroupChatsModule,
  ],
  providers: [Logger],
  controllers: [],
})
export class AppModule {}
