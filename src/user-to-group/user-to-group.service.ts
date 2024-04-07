import { Injectable } from '@nestjs/common';
import { CreateUserToGroupDto } from './dto/create-user-to-group.dto';
import { UpdateUserToGroupDto } from './dto/update-user-to-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserToGroupDocument } from './entities/user-to-group.model';
import { Model } from 'mongoose';

@Injectable()
export class UserToGroupService {
  constructor(
    @InjectModel('user_to_groups') private readonly userToGroupModel: Model<UserToGroupDocument>,
  ) { }

  async create(createUserToGroupDto: CreateUserToGroupDto): Promise<UserToGroupDocument> {
    const createdUserToGroup = new this.userToGroupModel(
      createUserToGroupDto,
    );
    createdUserToGroup.joinedAt = new Date();
    createdUserToGroup.isBlocked = false;
    return createdUserToGroup.save();
  }

  async findAll(): Promise<UserToGroupDocument[]> {
    return this.userToGroupModel.find().exec();
  }

  async findById(id: string): Promise<UserToGroupDocument> {
    return this.userToGroupModel.findById(id);
  }

  async update(id: string, updateUserToGroupDto: UpdateUserToGroupDto): Promise<UserToGroupDocument> {
    return this.userToGroupModel
      .findByIdAndUpdate(id, updateUserToGroupDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserToGroupDocument> {
    return this.userToGroupModel.findByIdAndDelete(id).exec();
  }
}
