import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { GeocodingResult } from '../ports/paymentProvider.port';

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
  description?: string;
  photos: string[];
  location: GeocodingResult;
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
    description: { type: String },
    photos: [{ type: String }],
    location: {
      coords: { type: [Number], required: true },
      displayName: { type: String, required: true },
      properties: {
        city: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
      },
    },
  },
  { timestamps: true },
);

export const PetModel = model<Pet>('Pets', PetSchema);
