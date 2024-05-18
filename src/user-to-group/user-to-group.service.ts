import {
  BadRequestException,
  ForbiddenException,
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
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserToGroupServiceEvent } from './entities/service-event.enum';
import { MemberRole } from './entities/member-role.enum';
import { UserServiceEvent } from 'src/user/entities/user-service-event.enum';
import { GroupChatServiceEvent } from 'src/group-chat/entities/group-chat-service-event.enum';

@Injectable()
export class UserToGroupService {
  constructor(
    @InjectModel(UserToGroup.name)
    private readonly userToGroupModel: Model<UserToGroupDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(UserToGroupServiceEvent.CREATING)
  async create(payload: CreateUserToGroupDto): Promise<UserToGroupDocument> {
    const existingUser = await this.eventEmitter.emitAsync(
      UserServiceEvent.FIND_BY_ID,
      payload.userId,
    );
    if (!existingUser) {
      throw new BadRequestException('User not found!');
    }

    const existingGroupChat = await this.eventEmitter.emitAsync(
      GroupChatServiceEvent.FIND_BY_ID,
      payload.groupChatId,
    );
    if (!existingGroupChat) {
      throw new BadRequestException('Group chat not found!');
    }

    const createdUserToGroup: UserToGroupDocument =
      await new this.userToGroupModel({
        ...payload,
        createAt: new Date(),
        isBlocked: false,
      }).save();
    return createdUserToGroup;
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

  async findAllByGroupChatId(groupId: string): Promise<UserToGroupDocument[]> {
    return await this.userToGroupModel
      .find({
        groupChatId: groupId,
        deleteAt: null,
      })
      .populate('userId')
      .exec();
  }

  @OnEvent(UserToGroupServiceEvent.USER_IN_GROUP_CHECKING)
  async isUserInGroupChat(
    userId: string,
    groupChatId: string,
  ): Promise<UserToGroupDocument> {
    const userToGroup: UserToGroupDocument = await this.userToGroupModel
      .findOne({
        userId: userId,
        groupChatId: groupChatId,
        deleteAt: null,
      })
      .exec();
    return userToGroup;
  }

  async updateRole(
    userId: string,
    role: MemberRole,
  ): Promise<UserToGroupDocument> {
    const existingUser = await this.eventEmitter.emitAsync(
      UserServiceEvent.FIND_BY_ID,
      userId,
    );
    if (!existingUser) {
      throw new BadRequestException('User not found!');
    }

    return await this.userToGroupModel
      .findByIdAndUpdate(userId, {
        role: role,
        updateAt: new Date(),
      })
      .exec();
  }

  async updateGroupChatHost(
    userId: string,
    payload: UpdateGroupChatHostDto,
  ): Promise<UserToGroupDocument> {
    const existingGroupChat = await this.eventEmitter.emitAsync(
      GroupChatServiceEvent.FIND_BY_ID,
      payload.groupChatId,
    );
    if (!existingGroupChat) {
      throw new BadRequestException('Group chat not found!');
    }

    const hostInGroupChat: UserToGroupDocument = await this.isUserInGroupChat(
      userId,
      payload.groupChatId,
    );
    if (!hostInGroupChat) {
      throw new ForbiddenException('Forbidden! Not a group chat member!');
    } else if (hostInGroupChat.role !== 'host') {
      throw new ForbiddenException('Forbidden! Not the group chat host!');
    }

    const newHostInGroupChat: UserToGroupDocument =
      await this.isUserInGroupChat(payload.newHostId, payload.groupChatId);
    if (!newHostInGroupChat) {
      throw new ForbiddenException('Forbidden! Not a group chat member!');
    }

    // * Updating host in group chat collection
    const updatedGroupChatHost = await this.eventEmitter.emitAsync(
      GroupChatServiceEvent.UPDATE_HOST,
      payload.groupChatId,
      payload.newHostId,
    );
    if (!updatedGroupChatHost) {
      throw new BadRequestException('Failed to update host for group chat!');
    }

    // * Updating role in user to group collection
    // ! This and the above method is violating the 3NF rule
    const updatingNewHostRole: UserToGroupDocument = await this.updateRole(
      payload.newHostId,
      MemberRole.Host,
    );
    if (!updatingNewHostRole) {
      throw new BadRequestException('Failed to update new host!');
    }

    return await this.updateRole(userId, MemberRole.Member);
  }

  async remove(id: string): Promise<UserToGroupDocument> {
    return this.userToGroupModel.findByIdAndDelete(id).exec();
  }
}
