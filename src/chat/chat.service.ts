import { Injectable } from '@nestjs/common';
import { MessagePayLoad } from './dto/message.payload.dto';
import { Socket } from 'socket.io';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { CreateChatHistoryDto } from 'src/chat-history/dto/create-chat-history.dto';
import { FetchChatHistoryDto } from 'src/chat-history/dto/fetch-chat-history.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserToGroupServiceEvent } from 'src/user-to-group/entities/service-event.enum';
import { MemberRole } from 'src/user-to-group/entities/member-role.enum';
import { InvitationService } from 'src/invitation/invitation.service';
import { IncomingInvitaionPayload } from './dto/incoming-invitaion.payload.dto';
import { CreateInvitationDto } from 'src/invitation/dto/create-invitation.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatHistoryService: ChatHistoryService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly invitationService: InvitationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async authorizeClient(client: Socket) {
    const token = await this.getAuthToken(client);
    if (!token) {
      return null;
    }
    const claims = await this.authorizeToken(token);
    if (!claims) {
      return null;
    }

    const user = await this.userService.findById(claims.sub);
    if (!user) {
      return null;
    }

    return user;
  }

  async saveNewMessages(payload: MessagePayLoad) {
    const newChatHistory: CreateChatHistoryDto = {
      userId: payload.userId,
      groupChatId: payload.groupChatId,
      message: payload.message,
      attachment: payload.attachements,
    };

    await this.chatHistoryService.create(newChatHistory);
  }

  async fetchUserInformation(userId: string) {
    return await this.userService.findById(userId);
  }

  async fetchChatHistory(userId: string, payload: FetchChatHistoryDto) {
    return await this.chatHistoryService.findAllByGroupChatId(userId, payload);
  }

  async verifyGroupChatMember(userId: string, groupChatId: string) {
    const userToGroup = await this.eventEmitter.emit(
      UserToGroupServiceEvent.USER_IN_GROUP_CHECKING,
      userId,
      groupChatId,
    );
    if (!userToGroup) {
      return false;
    }
    return true;
  }

  async verifyGroupChatAdmin(userId: string, groupChatId: string) {
    // ? Why this return an array?
    const userToGroup: any = await this.eventEmitter.emitAsync(
      UserToGroupServiceEvent.USER_IN_GROUP_CHECKING,
      userId,
      groupChatId,
    );
    if (!userToGroup) {
      console.log('User not in group');
      return false;
    }

    for (const user of userToGroup) {
      if (user.role === MemberRole.Host) {
        return true;
      }
    }

    return false;
  }

  async createInvitation(payload: IncomingInvitaionPayload) {
    const dto: CreateInvitationDto = {
      inviterId: payload.inviterId,
      recipientId: payload.recipientId,
      groupChatId: payload.groupChatId,
      inviteReason: payload.inviteReason,
      denyReason: null,
    };
    return await this.invitationService.create(dto);
  }

  async findUserByUsername(username: string) {
    return await this.userService.findByUsername(username);
  }

  // ! Could improve reuseablity of these two functions. This is duplicated in NotificationGateway
  private async getAuthToken(client: Socket): Promise<string> {
    const token =
      client.handshake.headers?.authorization || client.handshake.auth.Bearer;
    if (!token) {
      return null;
    }
    return token;
  }

  private async authorizeToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return {
        ...decoded,
        id: decoded.sub,
      };
    } catch (error) {
      return null;
    }
  }
}
