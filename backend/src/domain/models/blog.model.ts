import type { Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface Blog {
  _id?: Types.ObjectId;
  name: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<Blog>(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export const BlogModel = model<Blog>('Blog', BlogSchema);
