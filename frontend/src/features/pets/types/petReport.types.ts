import type { GeocodingResult } from '../../map/types/geocodingResult';

export type ReportType = 'lost' | 'found';

export interface PetReportData {
  name?: string;
  species: string;
  date: string;
  breed?: string;
  sex: 'Macho' | 'Hembra' | 'Desconocido';
  color: string;
  size: 'Pequeña' | 'Mediana' | 'Grande';
  description: string;

  images: File[];
  imageLayout?: string;

  address?: string;
  location: GeocodingResult | null;
  locationCoords?: [number, number];

  contactName: string;
  phoneNumber: string;
  email: string;
}
