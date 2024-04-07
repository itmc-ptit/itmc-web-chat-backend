import { Injectable } from "@nestjs/common";
import { ChatService } from "../chat.service";

@Injectable()
export class UserJoinedObserver {
    constructor(private readonly chatService: ChatService) {
        this.init();
    }

    private init() {
        this.chatService.onUserJoined().subscribe(({ roomId, userId }) => {
          console.log(`User ${userId} joined room ${roomId}`);
        });
      }
}