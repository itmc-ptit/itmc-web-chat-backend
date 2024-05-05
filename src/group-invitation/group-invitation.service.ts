import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupInvitation, InvitationStatus  } from './group-invitation.model';

@Injectable()
export class GroupInvitationService {
  constructor(
    @InjectModel('GroupInvitation') private readonly groupInvitationModel: Model<GroupInvitation>
  ) {}

  async create(group_id: string, inviter_id: string, invitee_id: string): Promise<GroupInvitation> {
    const newInvitation = new this.groupInvitationModel({
      group_id,
      inviter_id,
      invitee_id,
      status: InvitationStatus.IN_PROGRESS,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    });

    return newInvitation.save();
  }

  async findAll(): Promise<GroupInvitation[]> {
    return this.groupInvitationModel.find().exec();
  }

  async findOne(id: string): Promise<GroupInvitation> {
    return this.groupInvitationModel.findById(id).exec();
  }

  async updateStatus(id: string, status: InvitationStatus): Promise<GroupInvitation> {
    const invitation = await this.groupInvitationModel.findById(id).exec();
  
    invitation.status = status;
    invitation.updated_at = new Date();
  
    return invitation.save();
  }

  async remove(id: string): Promise<GroupInvitation> {
    const invitation = await this.groupInvitationModel.findById(id).exec();
    
    invitation.deleted_at = new Date();
    return invitation.save();
}
}
