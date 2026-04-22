import { Schema } from 'mongoose';

export interface ContentBlock {
  content: string;
  type: string;
}

export const ContentBlockSchema = new Schema<ContentBlock>(
  {
    content: { type: String, required: true },
    type: { type: String, required: true },
  },
  { _id: false },
);
