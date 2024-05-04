import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChatHistory,
  ChatHistoryDocument,
} from './entities/chat-history.model';

@Injectable()
export class ChatHistoryService {
  constructor(
    @InjectModel(ChatHistory.name)
    private readonly chatHistoryModel: Model<ChatHistoryDocument>,
  ) {}

  async create(createChatHistoryDto: CreateChatHistoryDto) {
    return await new this.chatHistoryModel({
      ...createChatHistoryDto,
      createAt: new Date(),
      updateAt: new Date(),
    }).save();
  }

  async findAll() {
    return await this.chatHistoryModel.find({ deleteAt: null }).exec();
  }

  async findById(id: string) {
    return await this.chatHistoryModel
      .findById({ _id: id, deleteAt: null })
      .exec();
  }

  async findAllByChatId(groupChatId: string) {
    return this.chatHistoryModel
      .find({ groupChatId: groupChatId, deleteAt: null })
      .exec();
  }

  async update(id: string, updateChatHistoryDto: UpdateChatHistoryDto) {
    const chatHistory = await this.findById(id);
    if (!chatHistory) {
      throw new BadRequestException('Chat history not found');
    }

    return this.chatHistoryModel
      .findByIdAndUpdate(
        id,
        {
          ...updateChatHistoryDto,
          updateAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async remove(id: string) {
    const chatHistory = await this.findById(id);
    if (!chatHistory) {
      throw new BadRequestException('Chat history not found');
    }

    return await this.chatHistoryModel
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
