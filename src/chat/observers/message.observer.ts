import { Injectable } from "@nestjs/common";
import { ChatService } from "../chat.service";

@Injectable()
export class MessageObserver {
    constructor(private readonly chatService: ChatService) {
        this.init();
    }

    private init() {
        this.chatService.onMessage().subscribe(({roomId, userId, message}) => {
            console.log('MessageObserver', {roomId, userId, message});
        });
    }
}