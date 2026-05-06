import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

/**
 * Interface representing a Purchased Plan in the system.
 * This represents the "snapshot" of a plan at the moment of purchase,
 * including its configuration (days, radius) and active status.
 */
export interface PurchasedPlan {
  _id: Types.ObjectId;
  petId: Types.ObjectId;
  name: string;
  price: number;
  duration: number;
  radius: number;
  features: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a new Purchased Plan.
 * Omits system-generated fields and the 'active' status (which defaults to false/pending).
 */
export type PurchasedPlanCreateInput = Omit<
  PurchasedPlan,
  '_id' | 'createdAt' | 'updatedAt' | 'active'
>;

/**
 *
 * Includes a reference to the 'Pets' model to link search efforts to a specific animal.
 * Uses 'timestamps: true' to automatically manage 'createdAt' and 'updatedAt'.
 */
const PurchasedPlanSchema = new Schema<PurchasedPlan>(
  {
    petId: {
      type: Schema.Types.ObjectId,
      ref: 'Pets',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    radius: { type: Number, required: true },
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
/**
 * Data model for PurchasedPlans.
 * Collection name: 'purchasedplans' (auto-pluralized by Mongoose).
 */
export const PurchasedPlanModel = model<PurchasedPlan>(
  'PurchasedPlans',
  PurchasedPlanSchema,
);
