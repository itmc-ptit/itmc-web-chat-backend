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
import { Model } from 'mongoose';
import { MemberRole } from 'src/user-to-group/entities/member-role.enum';
import { MemberStatus } from 'src/user-to-group/entities/member-status.enum';
import { CreateUserToGroupDto } from 'src/user-to-group/dto/create-user-to-group.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceEvent } from 'src/user-to-group/entities/service-event.enum';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectModel(GroupChat.name)
    private readonly groupChatModel: Model<GroupChatDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(payload: CreateGroupChatDto): Promise<GroupChatDocument> {
    const nameDuplicates = await this.isDuplicateName(payload.name);
    if (nameDuplicates) {
      throw new BadRequestException('Group chat name already exists!');
    }

    const groupChatDocument: Partial<GroupChatDocument> = {
      ...payload,
      createAt: new Date(),
      updateAt: new Date(),
      deleteAt: null,
    };

    const createdGroupChat: GroupChatDocument = await new this.groupChatModel(
      groupChatDocument,
    ).save();

    const createUserToGroupPayload: CreateUserToGroupDto = {
      userId: payload.hostId,
      groupChatId: createdGroupChat._id,
      role: MemberRole.Host,
      status: MemberStatus.Active,
    };

    // TODO: figure out how to use the enum user to group event to remove the string literal
    const createdUserToGroup = await this.eventEmitter.emitAsync(
      ServiceEvent.CREATING,
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

  async findById(id: string): Promise<GroupChatDocument> {
    return await this.groupChatModel.findOne({
      _id: id,
      deleteAt: null,
    });
  }

  async findByName(name: string): Promise<GroupChatDocument> {
    return await this.groupChatModel.findOne({
      name: name,
      deleteAt: null,
    });
  }

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
