import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupInvitationSchema } from './group-invitation.model';
import { GroupInvitationService } from './group-invitation.service';
import { GroupInvitationController } from './group-invitation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'GroupInvitation', schema: GroupInvitationSchema}]),
  ],
  providers: [GroupInvitationService],
  controllers: [GroupInvitationController],
})
export class GroupInvitationModule {}