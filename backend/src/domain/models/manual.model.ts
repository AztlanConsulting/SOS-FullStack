import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface IManual extends Document {
  name: string;
  price: number;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const manualSchema = new Schema<IManual>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export const ManualModel = model<IManual>('Manual', manualSchema);
