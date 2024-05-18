import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChatHistory,
  ChatHistoryDocument,
} from './entities/chat-history.model';
import { FetchChatHistoryDto } from './dto/fetch-chat-history.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserToGroupServiceEvent } from 'src/user-to-group/entities/service-event.enum';
import { UserServiceEvent } from 'src/user/entities/user-service-event.enum';
import { GroupChatServiceEvent } from 'src/group-chat/entities/group-chat-service-event.enum';
import { ChatHistoryServiceEvent } from './entities/chat-history-service-event.enum';

@Injectable()
export class ChatHistoryService {
  constructor(
    @InjectModel(ChatHistory.name)
    private readonly chatHistoryModel: Model<ChatHistoryDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(ChatHistoryServiceEvent.CREATE)
  async create(payload: CreateChatHistoryDto): Promise<ChatHistoryDocument> {
    const existingUser = await this.eventEmitter.emitAsync(
      UserServiceEvent.FIND_BY_ID,
      payload.userId,
    );
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const existingGroupChat = await this.eventEmitter.emitAsync(
      GroupChatServiceEvent.FIND_BY_ID,
      payload.groupChatId,
    );
    if (!existingGroupChat) {
      throw new BadRequestException('Group chat not found');
    }

    const userInGroupChat = await this.eventEmitter.emitAsync(
      UserToGroupServiceEvent.USER_IN_GROUP_CHECKING,
      payload.userId,
      payload.groupChatId,
    );
    if (!userInGroupChat) {
      throw new ForbiddenException('Forbidden! User not in group chat');
    }

    const now = new Date();
    const chatHistory = new this.chatHistoryModel({
      ...payload,
      createdAt: now,
      updatedAt: now,
    });
    return await chatHistory.save();
  }

  @OnEvent(ChatHistoryServiceEvent.FETCH_ONE)
  async findById(id: string) {
    return await this.chatHistoryModel
      .findById({ _id: id, deleteAt: null })
      .exec();
  }

  @OnEvent(ChatHistoryServiceEvent.FETCH)
  async findAllByGroupChatId(
    payload: FetchChatHistoryDto,
  ): Promise<ChatHistoryDocument[]> {
    if (!payload.groupChatId) {
      throw new BadRequestException('Group chat id is required');
    }

    const existingGroupChat = await this.eventEmitter.emitAsync(
      GroupChatServiceEvent.FIND_BY_ID,
      payload.groupChatId,
    );
    if (!existingGroupChat) {
      throw new BadRequestException('Group chat not found');
    }

    const messageTimestamp = payload.timestamp
      ? new Date(payload.timestamp)
      : new Date(new Date().getTime() + 10 * 60000);

    const numberOfMessages = payload.limit ? payload.limit : 10;

    return await this.chatHistoryModel
      .find({
        groupChatId: payload.groupChatId,
        createAt: { $gte: messageTimestamp },
        deleteAt: null,
      })
      .sort({ createAt: -1 })
      .limit(numberOfMessages)
      .exec();
  }

  async update(
    userIdFromToken: string,
    payload: UpdateChatHistoryDto,
  ): Promise<ChatHistoryDocument> {
    const existingChatHistory: ChatHistoryDocument = await this.findById(
      payload.chatHistoryId,
    );
    if (!existingChatHistory) {
      throw new BadRequestException('Chat history not found');
    }

    const userInGroupChat = await this.eventEmitter.emitAsync(
      UserToGroupServiceEvent.USER_IN_GROUP_CHECKING,
      userIdFromToken,
      existingChatHistory.groupChatId,
    );
    if (!userInGroupChat) {
      throw new ForbiddenException('Forbidden! User not in group chat');
    }

    return this.chatHistoryModel
      .findByIdAndUpdate(
        payload.chatHistoryId,
        {
          ...payload,
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
