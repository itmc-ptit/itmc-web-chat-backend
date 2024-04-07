import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type ChatBanDocument = ChatBan & Document;

@Schema()
export class ChatBan {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    charId: string;

    @Prop({ required: true })
    bannedBy: string;
    
    @Prop()
    banReason: string;
    
    @Prop({ required: true })
    startAt: Date;
    
    @Prop()
    endAt: Date;
}

export const ChatBanSchema = SchemaFactory.createForClass(ChatBan);