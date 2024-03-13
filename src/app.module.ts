import { Module } from '@nestjs/common';
import { AppGateway } from './app/app.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/itmc-web-chat'),
    AuthModule,
    UserModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
