import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { GroupChat, GroupChatDocument } from './entities/group-chat.model';
import { InjectModel } from '@nestjs/mongoose';
import { MemberRole } from 'src/user-to-group/entities/member-role.enum';
import { CreateUserToGroupDto } from 'src/user-to-group/dto/create-user-to-group.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserToGroupServiceEvent } from 'src/user-to-group/entities/service-event.enum';
import { GroupChatServiceEvent } from './entities/group-chat-service-event.enum';
import { Model } from 'mongoose';
import { UserServiceEvent } from 'src/user/entities/user-service-event.enum';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectModel(GroupChat.name)
    private readonly groupChatModel: Model<GroupChatDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(payload: CreateGroupChatDto): Promise<GroupChatDocument> {
    const duplicatingName = await this.isDuplicateName(payload.name);
    if (duplicatingName) {
      throw new BadRequestException('Group chat name already exists!');
    }

    const newGroupChatDocument: Partial<GroupChatDocument> = {
      ...payload,
      createAt: new Date(),
      updateAt: new Date(),
      deleteAt: null,
    };

    const createdGroupChat: GroupChatDocument = await new this.groupChatModel(
      newGroupChatDocument,
    ).save();

    const createUserToGroupPayload: CreateUserToGroupDto = {
      userId: payload.hostId,
      groupChatId: createdGroupChat._id,
      role: MemberRole.Host,
    };

    const createdUserToGroup = await this.eventEmitter.emitAsync(
      UserToGroupServiceEvent.CREATING,
      createUserToGroupPayload,
    );
    if (!createdUserToGroup) {
      throw new InternalServerErrorException(
        'Failed to add host to group chat!',
      );
    }

    return createdGroupChat;
  }

  async findAllByHostId(hostId: string): Promise<GroupChatDocument[]> {
    return await this.groupChatModel
      .find({
        hostId: hostId,
        deleteAt: null,
      })
      .exec();
  }

  @OnEvent(GroupChatServiceEvent.FIND_BY_ID)
  async findById(id: string): Promise<GroupChatDocument> {
    return await this.groupChatModel
      .findOne({
        _id: id,
        deleteAt: null,
      })
      .exec();
  }

  @OnEvent(GroupChatServiceEvent.FIND_BY_NAME)
  async findByName(name: string): Promise<GroupChatDocument> {
    return await this.groupChatModel.findOne({
      name: name,
      deleteAt: null,
    });
  }

  @OnEvent(GroupChatServiceEvent.IS_HOST)
  async isHost(userId: string, groupChatId: string): Promise<boolean> {
    const groupChat = await this.findById(groupChatId);
    if (!groupChat) {
      throw new BadRequestException('Group chat not found!');
    }

    return groupChat.hostId.toString() === userId;
  }

  @OnEvent(GroupChatServiceEvent.UPDATE_HOST)
  async updateHost(
    groupChatId: string,
    newHostId: string,
  ): Promise<GroupChatDocument> {
    const groupChat = await this.findById(groupChatId);
    if (!groupChat) {
      throw new BadRequestException('Group chat not found!');
    }

    const existingUser = await this.eventEmitter.emitAsync(
      UserServiceEvent.FIND_BY_ID,
      newHostId,
    );
    if (!existingUser) {
      throw new BadRequestException('User not found!');
    }

    return await this.groupChatModel
      .findByIdAndUpdate(
        groupChatId,
        {
          hostId: newHostId,
          updateAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  // TODO: update this method
  async update(
    hostId: string,
    payload: UpdateGroupChatDto,
  ): Promise<GroupChatDocument> {
    const updatingGroupChatId = payload.id;
    const existingGroupChat: GroupChat =
      await this.findById(updatingGroupChatId);
    if (!existingGroupChat) {
      throw new BadRequestException('Group chat not found!');
    }

    if (hostId !== payload.hostId) {
      throw new UnauthorizedException(
        'Unauthorized! Only host can update the group chat!',
      );
    }

    const nameDuplicates = await this.isDuplicateName(payload.name);
    if (nameDuplicates) {
      throw new BadRequestException('Group chat name already exists!');
    }

    const updatedGroupChat: Partial<GroupChatDocument> = {
      updateAt: new Date(),
    };

    if (payload.name !== existingGroupChat.name) {
      updatedGroupChat.name = payload.name;
    }

    if (payload.description !== existingGroupChat.description) {
      updatedGroupChat.description = payload.description;
    }

    if (payload.hostId !== existingGroupChat.hostId) {
      updatedGroupChat.hostId = payload.hostId;
    }

    return await this.groupChatModel
      .findByIdAndUpdate(updatingGroupChatId, updatedGroupChat, { new: true })
      .exec();
  }

  async remove(userId: string, id: string): Promise<GroupChatDocument> {
    const groupChat = await this.findById(id);
    if (!groupChat) {
      throw new BadRequestException('Group chat not found!');
    }

    if (groupChat.hostId !== userId) {
      throw new UnauthorizedException(
        'Unauthorized! Only host can delete the group chat!',
      );
    }

    return await this.groupChatModel
      .findByIdAndUpdate(
        id,
        {
          deleteAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  private async isDuplicateName(name: string): Promise<boolean> {
    const groupChat = await this.findByName(name);
    return groupChat ? true : false;
  }
}
