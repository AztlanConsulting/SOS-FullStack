import z from 'zod';
import { PET_REPORT_SEX_VALUES, PET_REPORT_SIZE_VALUES } from './clients.type';
import { FoundPetReport } from '@/domain/models/foundPet.model';

export interface GeocodingResult {
  coords: [number, number];
  displayName: string; // Contains the name of the location
  properties: Properties;
}

interface Properties {
  city: string;
  state: string;
  country: string;
}
