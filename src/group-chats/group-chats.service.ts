import { Injectable } from '@nestjs/common';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { GroupChatDocument } from './models/group-chat.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GroupChatsService {
  constructor(
    @InjectModel('group_chats')
    private readonly groupChatModel: Model<GroupChatDocument>,
  ) {}

  async create(
    createGroupChatDto: CreateGroupChatDto,
  ): Promise<GroupChatDocument> {
    const createdGroupChat = new this.groupChatModel(createGroupChatDto);
    return createdGroupChat.save();
  }

  async findAll(): Promise<GroupChatDocument[]> {
    return this.groupChatModel.find().exec();
  }

  async findById(id: string): Promise<GroupChatDocument> {
    return this.groupChatModel.findById(id);
  }

  async update(
    id: string,
    updateGroupChatDto: UpdateGroupChatDto,
  ): Promise<GroupChatDocument> {
    return this.groupChatModel
      .findByIdAndUpdate(id, updateGroupChatDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<GroupChatDocument> {
    return this.groupChatModel.findByIdAndDelete(id).exec();
  }
}
