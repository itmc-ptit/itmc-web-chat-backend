import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserToGroupDto } from './dto/create-user-to-group.dto';
import { UpdateGroupChatHostDto } from './dto/update-group-chat-host.dto';
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
import { ServiceEvent } from './entities/service-event.enum';
import { MemberRole } from './entities/member-role.enum';

@Injectable()
export class UserToGroupService {
  constructor(
    @InjectModel(UserToGroup.name)
    private readonly userToGroupModel: Model<UserToGroupDocument>,
    private readonly groupChatService: GroupChatService,
    private readonly userService: UserService,
  ) {}

  @OnEvent(ServiceEvent.CREATING)
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

    try {
      const createdUserToGroup: UserToGroupDocument =
        await new this.userToGroupModel({
          ...payload,
          createAt: new Date(),
          isBlocked: false,
        }).save();
      return createdUserToGroup;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  async isUserInGroupChat(
    userId: string,
    groupId: string,
  ): Promise<UserToGroupDocument> {
    const userToGroup: UserToGroupDocument = await this.userToGroupModel
      .findOne({
        userId: userId,
        groupChatId: groupId,
        deleteAt: null,
      })
      .exec();
    return userToGroup;
  }

  async updateGroupChatHost(
    userId: string,
    payload: UpdateGroupChatHostDto,
  ): Promise<UserToGroupDocument> {
    const updatingGroupChat = await this.groupChatService.findById(
      payload.groupChatId,
    );
    if (!updatingGroupChat) {
      throw new BadRequestException('Group chat not found!');
    }

    const hostInGroupChat: UserToGroupDocument = await this.isUserInGroupChat(
      userId,
      payload.groupChatId,
    );
    if (!hostInGroupChat) {
      throw new UnauthorizedException('Unauthorized! Not a group chat member!');
    } else if (hostInGroupChat.role !== 'host') {
      throw new UnauthorizedException('Unauthorized! Not the group chat host!');
    }

    const newHostInGroupChat: UserToGroupDocument =
      await this.isUserInGroupChat(payload.newHostId, payload.groupChatId);
    if (!newHostInGroupChat) {
      throw new UnauthorizedException('Unauthorized! Not a group chat member!');
    }

    const updatedGroupChatHost = await this.groupChatService.updateHost(
      payload.groupChatId,
      payload.newHostId,
    );
    if (!updatedGroupChatHost) {
      throw new BadRequestException('Failed to update host!');
    }

    const updatedUserToGroupHost: UserToGroupDocument =
      await this.userToGroupModel.findByIdAndUpdate(newHostInGroupChat._id, {
        role: MemberRole.Host,
        updateAt: new Date(),
      });
    if (!updatedUserToGroupHost) {
      throw new BadRequestException('Failed to update new host!');
    }

    try {
      return await this.userToGroupModel
        .findByIdAndUpdate(
          hostInGroupChat._id,
          {
            hostId: payload.newHostId,
            role: MemberRole.Member,
            updateAt: new Date(),
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<UserToGroupDocument> {
    return this.userToGroupModel.findByIdAndDelete(id).exec();
  }
}
