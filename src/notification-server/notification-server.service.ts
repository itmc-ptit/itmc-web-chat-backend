import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InvitationService } from 'src/invitation/invitation.service';
import { UserService } from 'src/user/user.service';

import { Socket } from 'socket.io';
import { PaginationPayloadDto } from './dto/pagination-payload.dto';
import { ReplyInvitationDto } from 'src/invitation/dto/reply-invitaion.dto';

@Injectable()
export class NotificationGatewayService {
  constructor(
    private readonly notificationGatewayService: NotificationGatewayService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly invitationService: InvitationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async fetchReceivedInvitaions(userId: string, payload: PaginationPayloadDto) {
    return await this.invitationService.findAllReceivedInvitation(
      userId,
      payload.page,
      payload.limit,
    );
  }

  async fetchSentInvitaions(userId: string, payload: PaginationPayloadDto) {
    return await this.invitationService.findAllSentInvitation(
      userId,
      payload.page,
      payload.limit,
    );
  }

  async replyToInvitaion(userId: string, payload: ReplyInvitationDto) {
    return await this.invitationService.replyInvitaion(userId, payload);
  }

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

  // ! Could improve reuseablity of these two functions. This is duplicated in chat.service.ts
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
