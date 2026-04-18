import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { Permission } from '@domain/models/permmision.model';

export interface Role {
  _id: Types.ObjectId;
  role: string;
  permissions: (Types.ObjectId | Permission)[];
}

const RoleSchema = new Schema<Role>({
  role: { type: String, required: true, unique: true },
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Permissions',
    },
  ],
});

export const RoleModel = model<Role>('Roles', RoleSchema);
