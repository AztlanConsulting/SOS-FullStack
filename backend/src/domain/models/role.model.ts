import { Types, Schema, model } from 'mongoose';
import type { Resource } from './resources.model';

export interface Role {
  _id: Types.ObjectId;
  role: string;
  permissions: {
    resourceId: Types.ObjectId | Resource;
    actions: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  }[];
}

const RoleSchema = new Schema({
  role: { type: String, required: true, unique: true },
  permissions: [
    {
      resourceId: {
        type: Types.ObjectId,
        references: 'Resources',
        required: true,
      },
      actions: {
        create: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
    },
  ],
});

export const RoleModel = model<Role>('Roles', RoleSchema);
