import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { GroupChat, GroupChatDocument } from './entities/group-chat.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectModel(GroupChat.name)
    private readonly groupChatModel: Model<GroupChatDocument>,
  ) {}

  async create(payload: CreateGroupChatDto): Promise<GroupChatDocument> {
    const nameDuplicates = await this.isDuplicateName(payload.name);
    if (nameDuplicates) {
      throw new BadRequestException('Group chat name already exists!');
    }

    const groupChat: Partial<GroupChatDocument> = {
      ...payload,
      createAt: new Date(),
      updateAt: new Date(),
      deleteAt: null,
    };

    return await new this.groupChatModel(groupChat).save();
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
