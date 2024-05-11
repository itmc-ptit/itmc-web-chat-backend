import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { GroupChat, GroupChatDocument } from './entities/group-chat.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';

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

  async findAllByHostId(token: string): Promise<GroupChatDocument[]> {
    const claim = await this.extractToken(token);

    return await this.groupChatModel
      .find({
        hostId: claim.sub,
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
    token: string,
    updateGroupChatDto: UpdateGroupChatDto,
  ): Promise<GroupChatDocument> {
    console.log('payload:', updateGroupChatDto);

    const requestedGroupChatId = updateGroupChatDto.id;
    const existingGroupChatById = await this.findById(requestedGroupChatId);
    if (!existingGroupChatById) {
      throw new BadRequestException('Group chat not found!');
    }

    const claim = this.extractToken(token);
    console.log('claim:', claim);
    // if (claim.sub != )

    const existingGroupChatByName = await this.findByName(
      updateGroupChatDto.name,
    );
    if (existingGroupChatByName) {
      throw new BadRequestException('Group chat name already exists!');
    }

    if ('creatorId' in updateGroupChatDto) {
      throw new BadRequestException('Creator id cannot be updated!');
    }

    return await this.groupChatModel
      .findByIdAndUpdate(
        requestedGroupChatId,
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

  private async extractToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return decoded;
    } catch (err) {
      return err;
    }
  }
}
