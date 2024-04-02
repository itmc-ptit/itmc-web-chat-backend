import { Document } from 'mongoose';

export interface UserToGroup extends Document {
  user_id: string;
  chat_id: string;
  role: string;
  is_blocked: boolean;
  is_present: boolean;
} 