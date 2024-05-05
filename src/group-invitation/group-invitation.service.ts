import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupInvitationDocument } from './group-invitation.model';
import { InvitationStatus  } from './invitation-status.enum';

@Injectable()
export class GroupInvitationService {
  constructor(
    @InjectModel('GroupInvitation') private readonly groupInvitationModel: Model<GroupInvitationDocument>
  ) {}

  async create(group_id: string, inviter_id: string, invitee_id: string): Promise<GroupInvitationDocument> {
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

  async findAll(): Promise<GroupInvitationDocument[]> {
    return this.groupInvitationModel.find().exec();
  }

  async findOne(id: string): Promise<GroupInvitationDocument> {
    return this.groupInvitationModel.findById(id).exec();
  }

  async updateStatus(id: string, status: InvitationStatus): Promise<GroupInvitationDocument> {
    const invitation = await this.groupInvitationModel.findById(id).exec();
  
    invitation.status = status;
    invitation.updated_at = new Date();
  
    return invitation.save();
  }

  async remove(id: string): Promise<GroupInvitationDocument> {
    const invitation = await this.groupInvitationModel.findById(id).exec();
    
    invitation.deleted_at = new Date();
    return invitation.save();
}
}
