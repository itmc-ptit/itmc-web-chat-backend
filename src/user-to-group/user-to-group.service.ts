import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
import { UserDocument } from 'src/user/entities/user.model';
import { GroupChatDocument } from 'src/group-chat/entities/group-chat.model';
import { OnEvent } from '@nestjs/event-emitter';

export enum UserToGroupEvent {
  CREATING = 'user.creating',
}

@Injectable()
export class UserToGroupService {
  constructor(
    @InjectModel(UserToGroup.name)
    private readonly userToGroupModel: Model<UserToGroupDocument>,
    private readonly groupChatService: GroupChatService,
    private readonly userService: UserService,
  ) {}

  @OnEvent(UserToGroupEvent.CREATING)
  async create(payload: CreateUserToGroupDto): Promise<UserToGroupDocument> {
    const targetingUser: UserDocument = await this.userService.findById(
      payload.userId,
    );
    if (!targetingUser) {
      throw new BadRequestException('User not found!');
    }

    const targetingGroupChat: GroupChatDocument =
      await this.groupChatService.findById(payload.groupChatId);
    if (!targetingGroupChat) {
      throw new BadRequestException('Group chat not found!');
    }

    return await new this.userToGroupModel({
      ...payload,
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

  async findAllByUserId(userId: string): Promise<UserToGroupDocument[]> {
    return await this.userToGroupModel
      .find({
        userId: userId,
        deleteAt: null,
      })
      .populate('groupChatId')
      .exec();
  }

  async findAllByGroupId(groupId: string): Promise<UserToGroupDocument[]> {
    return await this.userToGroupModel
      .find({
        groupChatId: groupId,
        deleteAt: null,
      })
      .populate('userId')
      .exec();
  }

  async update(
    id: string,
    payload: UpdateUserToGroupDto,
  ): Promise<UserToGroupDocument> {
    return this.userToGroupModel
      .findByIdAndUpdate(
        id,
        {
          ...payload,
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
