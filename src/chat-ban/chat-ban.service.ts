import { Injectable } from '@nestjs/common';
import { CreateChatBanDto } from './dto/create-chat-ban.dto';
import { UpdateChatBanDto } from './dto/update-chat-ban.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatBanDocument } from './entities/chat-ban.model';

@Injectable()
export class ChatBanService {
  constructor(
    @InjectModel('chat_bans') private readonly chatBanModel: Model<ChatBanDocument>,
  ) {}

  async create(createChatBanDto: CreateChatBanDto) {
    const createdChatBan = new this.chatBanModel(createChatBanDto);
    createdChatBan.startAt = new Date();
    return createdChatBan.save();
  }

  async findAll() {
    return this.chatBanModel.find().exec();
  }

  async findOne(id: string) {
    return this.chatBanModel.findById(id);
  }

  async update(id: string, updateChatBanDto: UpdateChatBanDto) {
    return this.chatBanModel.findByIdAndUpdate(id, updateChatBanDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.chatBanModel.findByIdAndDelete(id).exec();
  }
}
