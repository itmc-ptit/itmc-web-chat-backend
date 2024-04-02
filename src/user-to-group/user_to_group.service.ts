import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserToGroup } from './user_to_group.interface';

@Injectable()
export class UserToGroupService {
  constructor(@InjectModel('UserToGroup') private readonly userToGroupModel: Model<UserToGroup>) {}

  async create(userToGroupData: any): Promise<UserToGroup> {
    const createdUserToGroup = new this.userToGroupModel(userToGroupData);
    return createdUserToGroup.save();
  }
}