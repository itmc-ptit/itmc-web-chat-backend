import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { UserService } from 'src/user/user.service';
import { GroupChatService } from 'src/group-chat/group-chat.service';
import { UserDocument } from 'src/user/entities/user.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserToGroupServiceEvent } from 'src/user-to-group/entities/service-event.enum';
import { Invitation, InvitationDocument } from './entities/invitation.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  InvitationStatus,
  toInvitationStatus,
} from './entities/invitation-status.enum';
import { UserToGroupDocument } from 'src/user-to-group/entities/user-to-group.model';
import { ReplyInvitationDto } from './dto/reply-invitaion.dto';
import { repl } from '@nestjs/core';

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<InvitationDocument>,
    private readonly userService: UserService,
    private readonly groupChatService: GroupChatService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(payload: CreateInvitationDto): Promise<InvitationDocument> {
    const existingGroupChat = await this.groupChatService.findById(
      payload.groupChatId,
    );
    if (!existingGroupChat) {
      throw new BadRequestException('Group chat not found');
    }

    const existingInviter: UserDocument = await this.userService.findById(
      payload.inviterId,
    );
    if (!existingInviter) {
      throw new BadRequestException('Inviter not found');
    }

    const inviterIsHost: boolean = await this.groupChatService.isHost(
      payload.inviterId,
      payload.groupChatId,
    );
    if (inviterIsHost == false) {
      throw new ForbiddenException('Forbidden! Inviter must be host');
    }

    const recipientInGroupChat: any[] = await this.eventEmitter.emitAsync(
      UserToGroupServiceEvent.USER_IN_GROUP_CHECKING,
      payload.recipientId,
      payload.groupChatId,
    );

    if (recipientInGroupChat[0]) {
      throw new BadRequestException('Recipient is already in group');
    }

    try {
      const invitaion: InvitationDocument = await new this.invitationModel({
        ...payload,
        createAt: new Date(),
        updateAt: new Date(),
        status: InvitationStatus.PENDING,
      }).save();

      return invitaion;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Invitation already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<InvitationDocument[]> {
    return await this.invitationModel.find({
      deleteAt: null,
    });
  }

  async findById(id: string): Promise<InvitationDocument> {
    return await this.invitationModel
      .findById(id, {
        deleteAt: null,
      })
      .exec();
  }

  async findAllByInviterId(inviterId: string): Promise<InvitationDocument[]> {
    return await this.invitationModel
      .find({
        inviterId: inviterId,
        deleteAt: null,
      })
      .populate('recipientId')
      .populate('groupChatId');
  }

  async findAllByRecipientId(
    recipientId: string,
  ): Promise<InvitationDocument[]> {
    return await this.invitationModel
      .find({
        recipientId: recipientId,
        deleteAt: null,
      })
      .populate('inviterId')
      .populate('groupChatId');
  }

  async replyInvitaion(
    userIdFromToken: string,
    payload: ReplyInvitationDto,
  ): Promise<InvitationDocument> {
    const existingInvitation: InvitationDocument =
      await this.invitationModel.findById(payload.invitationId);
    if (!existingInvitation) {
      throw new BadRequestException('Invitation not found');
    }

    if (userIdFromToken !== existingInvitation.recipientId.toString()) {
      throw new ForbiddenException('Forbidden! User cannot reply invitation');
    }

    if (existingInvitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Invitation already replied');
    }

    if (payload.status.toLowerCase() === InvitationStatus.PENDING) {
      throw new BadRequestException('Invalid status');
    }

    if (
      payload.status.toLowerCase() === InvitationStatus.REJECTED &&
      !payload.denyReason
    ) {
      throw new BadRequestException('Deny reason is required');
    }

    if (
      payload.status.toLowerCase() === InvitationStatus.ACCEPTED &&
      payload.denyReason
    ) {
      throw new BadRequestException('Deny reason is not required');
    }

    const reply = {
      status: payload.status as InvitationStatus,
      denyReason: payload.denyReason,
      updateAt: new Date(),
    };
    if (payload.status.toLowerCase() !== 'rejected') {
      reply.denyReason = null;
    }

    try {
      const repliedInvitation: InvitationDocument = await this.invitationModel
        .findByIdAndUpdate(payload.invitationId, reply, { new: true })
        .exec();
      return repliedInvitation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    userIdFromtoken: string,
    payload: UpdateInvitationDto,
  ): Promise<InvitationDocument> {
    const existingInvitation: InvitationDocument =
      await this.invitationModel.findById(payload.invitaionId);
    if (!existingInvitation) {
      throw new BadRequestException('Invitation not found');
    }

    if (
      userIdFromtoken !== existingInvitation.recipientId.toString() &&
      userIdFromtoken !== existingInvitation.inviterId.toString()
    ) {
      throw new ForbiddenException('Forbidden! User cannot update invitation');
    }

    return await this.invitationModel.findByIdAndUpdate(payload.invitaionId, {
      status: payload.status,
      inviteReason: payload.inviteReason,
      denyReason: payload.denyReason,
      updateAt: new Date(),
    });
  }

  async remove(id: string): Promise<InvitationDocument> {
    const existingInvitation: InvitationDocument =
      await this.invitationModel.findById(id);
    if (!existingInvitation) {
      throw new BadRequestException('Invitation not found');
    }

    return await this.invitationModel.findByIdAndUpdate(id, {
      deleteAt: new Date(),
    });
  }
}
