import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface FoundPetReport {
  id?: string;
  species: string;
  date: string;
  breed?: string;
  sex: 'Macho' | 'Hembra' | 'Desconocido';
  color: string;
  size:
    | 'Mini: 1 a 4 kg'
    | 'Pequeña: 5 a 10 kg'
    | 'Mediana: 11 a 25 kg'
    | 'Grande: 26 a 45 kg'
    | 'Gigante: más de 45 kg';
  description: string;
  location?: string;
  locationCoords?: [number, number];
  contactName: string;
  phoneNumber: string;
  email: string;
}

export interface IFoundPet extends FoundPetReport, Document {
  createdAt: Date;
  updatedAt: Date;
}

const foundPetSchema = new Schema<IFoundPet>(
  {
    species: { type: String, required: true },
    date: { type: String, required: true },
    breed: { type: String },
    sex: {
      type: String,
      required: true,
      enum: ['Macho', 'Hembra', 'Desconocido'],
    },
    color: { type: String, required: true },
    size: {
      type: String,
      required: true,
      enum: [
        'Mini: 1 a 4 kg',
        'Pequeña: 5 a 10 kg',
        'Mediana: 11 a 25 kg',
        'Grande: 26 a 45 kg',
        'Gigante: más de 45 kg',
      ],
    },
    description: { type: String, required: true },
    location: { type: String },
    locationCoords: { type: [Number] },
    contactName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true },
);

export const FoundPetModel = model<IFoundPet>('FoundPet', foundPetSchema);
