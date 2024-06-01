import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InvitationDocument } from './entities/invitation.entity';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { AccessTokenGuard } from 'src/auth/gurads/access-token-auth.guard';
import { ReplyInvitationDto } from './dto/reply-invitaion.dto';

@UseGuards(AccessTokenGuard)
@Controller('api/v1/invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get('/received')
  findAllByRecipientId(@Req() req: any): Promise<InvitationDocument[]> {
    const user: UserResponse = req.user;
    return this.invitationService.findAllByRecipientId(user._id.toString());
  }

  @Get('/sent')
  findAllByInviterId(@Req() req: any): Promise<InvitationDocument[]> {
    const user: UserResponse = req.user;
    return this.invitationService.findAllByInviterId(user._id.toString());
  }

  @Patch('reply')
  replyToInvitaion(
    @Req() req: any,
    @Body() payload: ReplyInvitationDto,
  ): Promise<InvitationDocument> {
    const user: UserResponse = req.user;
    return this.invitationService.replyInvitaion(user._id.toString(), payload);
  }

  @Post()
  create(@Body() payload: CreateInvitationDto): Promise<InvitationDocument> {
    return this.invitationService.create(payload);
  }

  @Get()
  findAll(): Promise<InvitationDocument[]> {
    return this.invitationService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<InvitationDocument> {
    return this.invitationService.findById(id);
  }

  @Patch()
  update(
    @Req() req: any,
    @Body() payload: UpdateInvitationDto,
  ): Promise<InvitationDocument> {
    const user: UserResponse = req.user;
    return this.invitationService.update(user._id.toString(), payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<InvitationDocument> {
    return this.invitationService.remove(id);
  }
}
