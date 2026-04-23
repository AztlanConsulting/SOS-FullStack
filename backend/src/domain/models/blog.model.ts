import type { Types } from 'mongoose';
import { model, Schema } from 'mongoose';
import type { ContentBlock } from '@validation/content.types';
import { ContentBlockSchema } from '@validation/content.types';

export interface Blog {
  _id?: Types.ObjectId;
  name: string;
  duration: number;
  content: ContentBlock[];
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<Blog>(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    content: { type: [ContentBlockSchema], required: true, default: [] },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export const BlogModel = model<Blog>('Blog', BlogSchema);
