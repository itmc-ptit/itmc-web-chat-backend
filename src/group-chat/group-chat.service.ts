import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { GroupChat, GroupChatDocument } from './models/group-chat.model';
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
    const groupChat = this.groupChatModel.findOne({
      name: createGroupChatDto.name,
      deleteAt: null,
    });
    if (groupChat) {
      throw new BadRequestException('Group chat already exists!');
    }

    return await new this.groupChatModel({
      ...createGroupChatDto,
      createdAt: new Date(),
    }).save();
  }

  async findAll(): Promise<GroupChatDocument[]> {
    return await this.groupChatModel.find({ deleteAt: null }).exec();
  }

  async findById(id: string): Promise<GroupChatDocument> {
    const groupChat = this.groupChatModel.findOne({
      _id: id,
      deleteAt: null,
    });
    if (!groupChat) {
      throw new BadRequestException('Group chat not found!');
    }

    return await groupChat;
  }

  async findByName(name: string): Promise<GroupChatDocument> {
    const groupChat = this.groupChatModel.findOne({
      name: name,
      deleteAt: null,
    });
    if (!groupChat) {
      throw new BadRequestException('Group chat not found!');
    }
    return await groupChat;
  }

  async update(
    id: string,
    updateGroupChatDto: UpdateGroupChatDto,
  ): Promise<GroupChatDocument> {
    const groupChat = this.findById(id);
    if (!groupChat) {
      throw new BadRequestException('Group chat not found!');
    }

    if (
      this.groupChatModel.findOne({
        name: updateGroupChatDto.name,
        deleteAt: null,
      })
    ) {
      throw new BadRequestException('Group chat already exists!');
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
      .findByIdAndUpdate(id, {
        deleteAt: new Date(),
      })
      .exec();
  }
}
