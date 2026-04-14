import type { Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface Workshop {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  price: number; // MXN
  category: string[];
  img: {
    data: Buffer;
    contentType: string;
  };
}

const WorkshopSchema = new Schema<Workshop>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: [String] },
  img: {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
});

export const WorkshopModel = model<Workshop>('Workshop', WorkshopSchema);
