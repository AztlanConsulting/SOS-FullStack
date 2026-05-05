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
  socialPosts?: {
    facebook?: {
      url: { type: String };
      status: {
        type: String;
        enum: ['pending', 'posted', 'failed'];
        default: 'pending';
      };
      postedAt: { type: Date };
    };
    instagram?: {
      url: { type: String };
      status: {
        type: String;
        enum: ['pending', 'posted', 'failed'];
        default: 'pending';
      };
      postedAt: { type: Date };
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export type PurchasedPlanCreateInput = Omit<
  PurchasedPlan,
  '_id' | 'createdAt' | 'updatedAt' | 'active'
>;

export type SocialPlatform = 'facebook' | 'instagram';

export type SocialPost = {
  url?: string;
  status?: 'pending' | 'posted' | 'failed';
  postedAt?: Date;
};

export type SocialPostsInput = Partial<Record<SocialPlatform, SocialPost>>;

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

    socialPosts: {
      facebook: {
        url: { type: String },
        status: {
          type: String,
          enum: ['pending', 'posted', 'failed'],
          default: 'pending',
        },
        postedAt: { type: Date },
      },
      instagram: {
        url: { type: String },
        status: {
          type: String,
          enum: ['pending', 'posted', 'failed'],
          default: 'pending',
        },
        postedAt: { type: Date },
      },
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
