import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatBanDto } from './dto/create-chat-ban.dto';
import { UpdateChatBanDto } from './dto/update-chat-ban.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatBan, ChatBanDocument } from './entities/chat-ban.model';

@Injectable()
export class ChatBanService {
  constructor(
    @InjectModel(ChatBan.name)
    private readonly chatBanModel: Model<ChatBanDocument>,
  ) {}

  async create(createChatBanDto: CreateChatBanDto) {
    return await new this.chatBanModel({
      ...createChatBanDto,
      createAt: new Date(),
    }).save();
  }

  async findAll() {
    return await this.chatBanModel.find({ deleteAt: null }).exec();
  }

  async findById(id: string) {
    return await this.chatBanModel
      .findOne({
        _id: id,
        deleteAt: null,
      })
      .exec();
  }

  async update(id: string, updateChatBanDto: UpdateChatBanDto) {
    const chatBan = this.findById(id);
    if (!chatBan) {
      throw new BadRequestException('Chat ban not found');
    }

    return await this.chatBanModel
      .findByIdAndUpdate(
        id,
        {
          ...updateChatBanDto,
          updateAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async remove(id: string) {
    const chatBan = this.findById(id);
    if (!chatBan) {
      throw new BadRequestException('Chat ban not found');
    }

    return this.chatBanModel
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
