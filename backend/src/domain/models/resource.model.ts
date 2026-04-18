import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface Resource {
  _id: Types.ObjectId;
  name: string;
  description: string;
}

const ResourcesSchema = new Schema<Resource>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

export const ResourcesModel = model<Resource>('Resources', ResourcesSchema);
