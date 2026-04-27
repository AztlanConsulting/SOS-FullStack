import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface Pet {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  species: string;
  dateMissing: Date;
  breed: string;
  sex: string;
  color: string;
  size: string;
  description: string;
  photos: string[];
  placeMissing: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PetCreateInput = Omit<Pet, '_id' | 'createdAt' | 'updatedAt'>;

const PetSchema = new Schema<Pet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    name: { type: String },
    species: { type: String, required: true },
    dateMissing: { type: Date, required: true },
    breed: { type: String },
    sex: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    description: { type: String, required: true },
    photos: [{ type: String }],
    placeMissing: { type: String },
  },
  { timestamps: true },
);

export const PetModel = model<Pet>('Pets', PetSchema);
