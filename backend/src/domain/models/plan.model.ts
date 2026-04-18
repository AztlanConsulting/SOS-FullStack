import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';

/**
 * Interface representing the Plan document structure in MongoDB.
 * Extends Mongoose Document to include standard document properties and methods.
 */
export interface IPlan extends Document {
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema definition for the Plan model.
 * Includes automatic timestamp management for createdAt and updatedAt fields.
 */
const planSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true },
);

export const PlanModel = model<IPlan>('Plan', planSchema);
