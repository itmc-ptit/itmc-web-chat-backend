import { Injectable } from '@nestjs/common';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistoryDocument } from './entities/chat-history.model';

@Injectable()
export class ChatHistoryService {
  constructor(
    @InjectModel('chat_histories')
    private readonly chatHistoryModel: Model<ChatHistoryDocument>,
  ) {}

  async create(createChatHistoryDto: CreateChatHistoryDto) {
    const createdChatHistory = new this.chatHistoryModel(createChatHistoryDto);
    createdChatHistory.sendAt = new Date();
    return createdChatHistory.save();
  }

  async findAll() {
    return this.chatHistoryModel.find().exec();
  }

  async findById(id: string) {
    return this.chatHistoryModel.findById(id);
  }

  async findAllByChatId(groupChatId: string) {
    return this.chatHistoryModel.find({ groupChatId: groupChatId }).exec();
  }

  async update(id: string, updateChatHistoryDto: UpdateChatHistoryDto) {
    return this.chatHistoryModel
      .findByIdAndUpdate(id, updateChatHistoryDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.chatHistoryModel.findByIdAndDelete(id).exec();
  }
}
