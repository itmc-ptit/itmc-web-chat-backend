import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserJoinedObserver } from './observers/user-joined.observer';
import { MessageObserver } from './observers/message.observer';

@Module({
    providers:[UserJoinedObserver, MessageObserver, ChatService, ChatGateway]
})
export class ChatModule {}
