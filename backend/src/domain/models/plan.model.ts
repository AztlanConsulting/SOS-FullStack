import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true },
);

export const PlanModel = model<IPlan>('Plan', planSchema);
