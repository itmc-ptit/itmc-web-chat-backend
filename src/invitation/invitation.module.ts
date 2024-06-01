import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { UserModule } from 'src/user/user.module';
import { GroupChatModule } from 'src/group-chat/group-chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from './entities/invitation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Invitation.name,
        schema: InvitationSchema,
        collection: 'invitations',
      },
    ]),
    UserModule,
    GroupChatModule,
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
