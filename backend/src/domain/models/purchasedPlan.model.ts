import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface SocialPost {
  url?: string;
  status?: 'pending' | 'posted' | 'failed';
  postedAt?: Date;
}

export interface PurchasedPlan {
  _id: Types.ObjectId;
  petId: Types.ObjectId;
  name: string;
  price: number;
  duration: number; // days
  radius: number; // km
  features: string[];
  active: boolean;
  socialPosts?: {
    facebook?: SocialPost;
    instagram?: SocialPost;
  };
  emailStatus?: 'pending' | 'sent' | 'failed';
  emailSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type PurchasedPlanCreateInput = Omit<
  PurchasedPlan,
  '_id' | 'createdAt' | 'updatedAt' | 'active'
>;

export type SocialPlatform = 'facebook' | 'instagram';

export type SocialPostsInput = Partial<Record<SocialPlatform, SocialPost>>;

const SocialPostSchema = new Schema<SocialPost>(
  {
    url: { type: String },
    status: {
      type: String,
      enum: ['pending', 'posted', 'failed'],
      default: 'pending',
    },
    postedAt: { type: Date },
  },
  { _id: false },
);

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
    active: { type: Boolean, default: false },
    socialPosts: {
      facebook: SocialPostSchema,
      instagram: SocialPostSchema,
    },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    emailSentAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const PurchasedPlanModel = model<PurchasedPlan>(
  'PurchasedPlans',
  PurchasedPlanSchema,
);
