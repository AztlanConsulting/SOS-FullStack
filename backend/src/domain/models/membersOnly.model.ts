import type { Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface MembersOnly {
  _id?: Types.ObjectId;
  name: string;
  duration: number;
  content: string;
  imageUrl: string;
  pdfUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const MembersOnlySchema = new Schema<MembersOnly>(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    pdfUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export const MembersOnlyModel = model<MembersOnly>(
  'MembersOnly',
  MembersOnlySchema,
);
