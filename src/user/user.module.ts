import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UsersController],
})
export class UserModule {}
