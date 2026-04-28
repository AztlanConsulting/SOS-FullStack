import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { ContentBlock } from '@validation/content.types';
import { ContentBlockSchema } from '@validation/content.types';

export interface IManual extends Document {
  name: string;
  price: number;
  content: ContentBlock[];
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const manualSchema = new Schema<IManual>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    content: { type: [ContentBlockSchema], required: true, default: [] },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export const ManualModel = model<IManual>('Manual', manualSchema);
