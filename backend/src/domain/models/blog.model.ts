import type { Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface BlogContentBlock {
  content: string;
  type: string;
}

export interface Blog {
  _id?: Types.ObjectId;
  name: string;
  duration: number;
  content: BlogContentBlock[];
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogContentBlockSchema = new Schema<BlogContentBlock>(
  {
    content: { type: String, required: true },
    type: { type: String, required: true },
  },
  { _id: false },
);

const BlogSchema = new Schema<Blog>(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    content: { type: [BlogContentBlockSchema], required: true, default: [] },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export const BlogModel = model<Blog>('Blog', BlogSchema);
