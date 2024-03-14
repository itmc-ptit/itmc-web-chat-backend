import { Module } from '@nestjs/common';
import { AppGateway } from './app/app.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/itmc-web-chat'),
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
  ],
  providers: [AppGateway],
})
export class AppModule {}
