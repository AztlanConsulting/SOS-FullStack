import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { Role } from './role.model';

export interface User {
  _id: Types.ObjectId;
  roleId: Types.ObjectId[] | Role[];
  username: string;
  password: string;
  email: string;
  phone: string;
  fbUser: string;
  conversation: string;
  active: boolean;
}

const UserSchema = new Schema({
  roleId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Roles',
      required: true,
    },
  ],
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  fbUser: { type: String },
  conversation: { type: String },
  active: { type: Boolean, default: true },
});

export const UserModel = model<User>('Users', UserSchema);
