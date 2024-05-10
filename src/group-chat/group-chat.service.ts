import { BadRequestException, Injectable } from '@nestjs/common';
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

  async create(
    createGroupChatDto: CreateGroupChatDto,
  ): Promise<GroupChatDocument> {
    const groupChat = await this.findByName(createGroupChatDto.name);
    if (groupChat) {
      throw new BadRequestException('Group chat name already exists!');
    }

    return await new this.groupChatModel({
      ...createGroupChatDto,
      createdAt: new Date(),
      updateAt: new Date(),
      deleteAt: null,
    }).save();
  }

  async findAll(): Promise<GroupChatDocument[]> {
    return await this.groupChatModel.find({ deleteAt: null }).exec();
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
    id: string,
    updateGroupChatDto: UpdateGroupChatDto,
  ): Promise<GroupChatDocument> {
    const existingGroupChatById = await this.findById(id);
    if (!existingGroupChatById) {
      throw new BadRequestException('Group chat not found!');
    }

    const existingGroupChatByName = await this.findByName(
      updateGroupChatDto.name,
    );
    if (existingGroupChatByName) {
      throw new BadRequestException('Group chat name already exists!');
    }

    if ('hostId' in updateGroupChatDto) {
      throw new BadRequestException('Host id cannot be updated!');
    }

    return await this.groupChatModel
      .findByIdAndUpdate(
        id,
        {
          ...updateGroupChatDto,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<GroupChatDocument> {
    const groupChat = this.findById(id);
    if (!groupChat) {
      throw new BadRequestException('Group chat not found!');
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
}
