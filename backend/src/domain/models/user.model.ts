import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  roleId: { type: Array, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, requried: true },
  phone: { type: String },
  fbUser: { type: String },
  conversation: { type: String },
  active: { type: Boolean, default: true },
});

export const UserModel = model('Users', UserSchema);
