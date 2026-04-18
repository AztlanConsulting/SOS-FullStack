import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface Permission {
  _id: Types.ObjectId;
  resourceId: Types.ObjectId;
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}

const PermissionSchema = new Schema<Permission>({
  resourceId: {
    type: Schema.Types.ObjectId,
    ref: 'Resources',
    required: true,
  },
  actions: {
    create: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
});

export const PermissionModel = model<Permission>(
  'Permissions',
  PermissionSchema,
);
