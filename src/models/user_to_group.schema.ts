import * as mongoose from 'mongoose';

export const UserToGroupSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  chat_id: mongoose.Schema.Types.ObjectId,
  role: { type: String, default: 'member' },
  is_blocked: { type: Boolean, default: false },
  is_present: { type: Boolean, default: false },
});