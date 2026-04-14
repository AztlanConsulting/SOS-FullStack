import type { Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface Workshop {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  price: number; // MXN
  category: string[];
  img: Buffer;
}

const WorkshopSchema = new Schema<Workshop>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: [String] },
  img: { data: Buffer, contentType: String, required: true },
});

export const WorkshopModel = model<Workshop>('Workshop', WorkshopSchema);
