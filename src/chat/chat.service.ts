import { Inject, Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { MessagePayLoad } from './dto/message.payload.dto';
import { JoinRoomPayload } from './dto/join-room.payload.dto';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject(ChatHistoryService)
    private chatHistoryService: ChatHistoryService,
  ) {}

  private messageSubject = new Subject<{
    roomId: string;
    userId: string;
    message: string;
  }>();

  private userJoinedSubject = new Subject<{
    roomId: string;
    userId: string;
  }>();

  handleMessage(payload: MessagePayLoad) {
    // * Saving the message to the database
    this.chatHistoryService.create({
      userId: payload.senderId,
      groupChatId: payload.roomId,
      message: payload.message,
      attachment: payload.attachements,
    });

    // * This is for observer pattern
    // this.messageSubject.next({
    //   roomId: payload.roomId,
    //   userId: payload.senderId,
    //   message: payload.message,
    // });
  }

  async handleUserJoined(payload: JoinRoomPayload) {
    const messages = this.chatHistoryService.findAllByChatId(payload.roomId);
    return messages;

    // * This is for observer pattern
    // this.userJoinedSubject.next({ roomId, userId });
  }

  onMessage() {
    return this.messageSubject.asObservable();
  }

  onUserJoined() {
    return this.userJoinedSubject.asObservable();
  }
}
