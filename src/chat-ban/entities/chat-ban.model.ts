import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChatBanDocument = ChatBan & Document;

@Schema()
export class ChatBan {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User'})
    userId: string;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'GroupChat'})
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