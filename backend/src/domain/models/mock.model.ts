import mongoose, { Schema } from 'mongoose';

// Temporary mock model used for architectural validation.
// This is not part of the final domain and will be removed in future iterations.

interface IMock {
  title: string;
  description: string;
  value: number;
  isActive: boolean;
  createdAt: Date;
}

const mockSchema = new Schema<IMock>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Mock = mongoose.model<IMock>('Mock', mockSchema);
