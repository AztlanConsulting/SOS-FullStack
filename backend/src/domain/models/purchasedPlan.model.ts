import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface PurchasedPlan {
  _id: Types.ObjectId;
  petId: Types.ObjectId;
  name: string;
  price: number;
  duration: number; // days
  radius: number; // km
  features: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PurchasedPlanCreateInput = Omit<
  PurchasedPlan,
  '_id' | 'createdAt' | 'updatedAt' | 'active'
>;

const PurchasedPlanSchema = new Schema<PurchasedPlan>(
  {
    petId: {
      type: Schema.Types.ObjectId,
      ref: 'Pets',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // days
    radius: { type: Number, required: true }, // km
    features: [{ type: String, required: true }],
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const PurchasedPlanModel = model<PurchasedPlan>(
  'PurchasedPlans',
  PurchasedPlanSchema,
);
