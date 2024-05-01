import { Injectable } from '@nestjs/common';
import { CreateUserToGroupDto } from './dto/create-user-to-group.dto';
import { UpdateUserToGroupDto } from './dto/update-user-to-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserToGroup,
  UserToGroupDocument,
} from './entities/user-to-group.model';
import { Model } from 'mongoose';

@Injectable()
export class UserToGroupService {
  constructor(
    @InjectModel(UserToGroup.name)
    private readonly userToGroupModel: Model<UserToGroupDocument>,
  ) {}

  async create(
    createUserToGroupDto: CreateUserToGroupDto,
  ): Promise<UserToGroupDocument> {
    return await new this.userToGroupModel({
      ...createUserToGroupDto,
      createAt: new Date(),
      isBlocked: false,
    }).save();
  }

  async findAll(): Promise<UserToGroupDocument[]> {
    return await this.userToGroupModel
      .find({
        deleteAt: null,
      })
      .exec();
  }

  async findById(id: string): Promise<UserToGroupDocument> {
    return await this.userToGroupModel
      .findOne({
        _id: id,
        deleteAt: null,
      })
      .exec();
  }

  async findByUserId(userId: string): Promise<UserToGroupDocument[]> {
    return await this.userToGroupModel
      .find({
        userId: userId,
        deleteAt: null,
      })
      .populate('groupChatId')
      .exec();
  }

  async update(
    id: string,
    updateUserToGroupDto: UpdateUserToGroupDto,
  ): Promise<UserToGroupDocument> {
    return this.userToGroupModel
      .findByIdAndUpdate(
        id,
        {
          ...updateUserToGroupDto,
          updateAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<UserToGroupDocument> {
    return this.userToGroupModel.findByIdAndDelete(id).exec();
  }
}
