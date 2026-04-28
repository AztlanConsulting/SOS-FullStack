import type { Types } from 'mongoose';
import { model, Schema } from 'mongoose';
import type { ContentBlock } from '@validation/content.types';
import { ContentBlockSchema } from '@validation/content.types';

export interface Workshop {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  price: number; // MXN;
  content: ContentBlock[];
  category: string[];
  img?: {
    data: Buffer;
    contentType: string;
  };
  imageUrl?: string;
}

const WorkshopSchema = new Schema<Workshop>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  content: { type: [ContentBlockSchema], required: true, default: [] },
  category: { type: [String] },
  img: {
    data: { type: Buffer },
    contentType: { type: String },
  },
  imageUrl: { type: String, required: true },
});

export const WorkshopModel = model<Workshop>('Workshop', WorkshopSchema);
