import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupInvitationService } from './group-invitation.service';
import { InvitationStatus  } from './group-invitation.model';


@Controller('group-invitation')
export class GroupInvitationController {
  constructor(private readonly groupInvitationService: GroupInvitationService) {}

  @Post(':group_id/:inviter_id/:invitee_id')
  create(
    @Param('group_id') group_id: string,
    @Param('inviter_id') inviter_id: string,
    @Param('invitee_id') invitee_id: string
  ) {
    return this.groupInvitationService.create(group_id, inviter_id, invitee_id);
  }

  @Get()
  findAll() {
    return this.groupInvitationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupInvitationService.findOne(id);
  }

  @Patch(':id/:status')
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: InvitationStatus
  ) {
    return this.groupInvitationService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupInvitationService.remove(id);
  }
}
