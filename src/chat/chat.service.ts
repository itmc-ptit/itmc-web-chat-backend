import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";

@Injectable()
export class ChatService {
    private messageSubject = new Subject<{
        roomId: string;
        userId: string;
        message: string;
    }>();

    private userJoinedSubject = new Subject<{
        roomId: string;
        userId: string;
    }>();

    handleMessage(roomId: string, userId: string, message: string) {
        this.messageSubject.next({ roomId, userId, message });
    }

    handleUserJoined(roomId: string, userId: string) {
        this.userJoinedSubject.next({ roomId, userId });
    }

    onMessage() {
        return this.messageSubject.asObservable();
    }

    onUserJoined() {
        return this.userJoinedSubject.asObservable();
    }
}