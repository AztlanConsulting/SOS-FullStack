import type { Document, Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface SearchFormReport {
  species: 'Dog' | 'Cat' | 'Other';
  size: 'Small' | 'Medium' | 'Large';
  approximateAge: number;
  sex: 'Male' | 'Female';
  sterilized: 'Yes' | 'No';
  collarTag: 'Yes' | 'No';
  physicalCondition: string;

  visualReferences: string;
  zoneType: 'Residential' | 'Rural' | 'City' | 'Highway';
  additionalCircumstances: string;

  personality: string;
  canBeCaught: 'Yes' | 'No' | 'Depends';
  noiseReaction: 'Scared' | 'Flees' | 'Ignores' | 'Other';
  noiseReactionOther?: string;
  respondsToName: 'Yes' | 'No' | 'Sometimes';
  usedToGoingOut: 'Yes' | 'No';
  hasEscapedBefore: 'Yes' | 'No';
  whatHappenedWhenEscaped?: string;
  fears: string;
  easilySocializes: 'Yes' | 'No';

  helpCount: 'Several people' | '1-2 people' | 'Alone';
  nearbyFeatures: string;
  streetAnimals: 'Many' | 'Few' | 'None' | 'Unknown';
  trafficLevel: 'High' | 'Medium' | 'Low';
  zoneFamiliarity: 'Very familiar' | 'Somewhat' | 'Not at all';

  attachedTo: string;
  toyBlanket: string;
  favoriteFood: string;
  whatBringsBack: string;
  favoritePlace: string;

  vaccinationCard: string;
}

export interface ISearchForm extends SearchFormReport, Document {}

const searchFormSchema = new Schema<ISearchForm>(
  {
    species: {
      type: String,
      required: true,
      enum: ['Dog', 'Cat', 'Other'],
    },
    size: {
      type: String,
      required: true,
      enum: ['Small', 'Medium', 'Large'],
    },
    approximateAge: { type: Number, required: true },
    sex: {
      type: String,
      required: true,
      enum: ['Male', 'Female'],
    },
    sterilized: { type: String, required: true, enum: ['Yes', 'No'] },
    collarTag: { type: String, required: true, enum: ['Yes', 'No'] },
    physicalCondition: { type: String, required: true },

    visualReferences: { type: String, required: true },
    zoneType: {
      type: String,
      required: true,
      enum: ['Residential', 'Rural', 'City', 'Highway'],
    },
    additionalCircumstances: { type: String, required: true },

    personality: { type: String, required: true },
    canBeCaught: {
      type: String,
      required: true,
      enum: ['Yes', 'No', 'Depends'],
    },
    noiseReaction: {
      type: String,
      required: true,
      enum: ['Scared', 'Flees', 'Ignores', 'Other'],
    },
    noiseReactionOther: { type: String, required: false },
    respondsToName: {
      type: String,
      required: true,
      enum: ['Yes', 'No', 'Sometimes'],
    },
    usedToGoingOut: { type: String, required: true, enum: ['Yes', 'No'] },
    hasEscapedBefore: { type: String, required: true, enum: ['Yes', 'No'] },
    whatHappenedWhenEscaped: { type: String, required: false },
    fears: { type: String, required: true },
    easilySocializes: {
      type: String,
      required: true,
      enum: ['Yes', 'No'],
    },

    helpCount: {
      type: String,
      required: true,
      enum: ['Several people', '1-2 people', 'Alone'],
    },
    nearbyFeatures: { type: String, required: true },
    streetAnimals: {
      type: String,
      required: true,
      enum: ['Many', 'Few', 'None', 'Unknown'],
    },
    trafficLevel: {
      type: String,
      required: true,
      enum: ['High', 'Medium', 'Low'],
    },
    zoneFamiliarity: {
      type: String,
      required: true,
      enum: ['Very familiar', 'Somewhat', 'Not at all'],
    },

    attachedTo: { type: String, required: true },
    toyBlanket: { type: String, required: true },
    favoriteFood: { type: String, required: true },
    whatBringsBack: { type: String, required: true },
    favoritePlace: { type: String, required: true },

    vaccinationCard: { type: String, required: true },
  },
  { timestamps: true },
);

export const SearchFormModel = model<ISearchForm>(
  'SearchForm',
  searchFormSchema,
);
