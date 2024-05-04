import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserToGroupDto } from './dto/create-user-to-group.dto';
import { UpdateUserToGroupDto } from './dto/update-user-to-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserToGroup,
  UserToGroupDocument,
} from './entities/user-to-group.model';
import { Model } from 'mongoose';
import { GroupChatService } from 'src/group-chat/group-chat.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserToGroupService {
  constructor(
    @InjectModel(UserToGroup.name)
    private readonly userToGroupModel: Model<UserToGroupDocument>,
    private readonly groupChatService: GroupChatService,
    private readonly userService: UserService,
  ) {}

  async create(
    createUserToGroupDto: CreateUserToGroupDto,
  ): Promise<UserToGroupDocument> {
    const targetingUser = await this.userService.findById(
      createUserToGroupDto.userId,
    );
    if (!targetingUser) {
      throw new BadRequestException('User not found!');
    }

    const targetingGroupChat = await this.groupChatService.findById(
      createUserToGroupDto.groupChatId,
    );
    if (!targetingGroupChat) {
      throw new BadRequestException('Group chat not found!');
    }

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
