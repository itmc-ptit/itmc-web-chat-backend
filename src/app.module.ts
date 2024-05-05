import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupInvitationModule } from './group-invitation/group-invitation.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:2717/mydatabase'),
    GroupInvitationModule,
  ],
})
export class AppModule {}