import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChatHistoryDocument = ChatHistory & Document;

@Schema()
export class ChatHistory {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'GroupChat', required: true })
    @Prop({ required: true })
    chatId: string;
    
    @Prop({ required: true })
    message: string;

    @Prop({ required: false })
    attachment: string;

    @Prop({ required: true })
    sendAt: Date;
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
