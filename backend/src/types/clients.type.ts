export type PetReportSex = 'Macho' | 'Hembra' | 'Desconocido';

export type PetReportSize =
  | 'Mini: 1 a 4 kg'
  | 'Pequeña: 5 a 10 kg'
  | 'Mediana: 11 a 25 kg'
  | 'Grande: 26 a 45 kg'
  | 'Gigante: más de 45 kg';

export type CreatePetReportDTO = {
  name?: string;
  species: string;
  date: string;
  breed?: string;
  sex: PetReportSex;
  color: string;
  size: PetReportSize;
  description: string;
  location?: string;
  locationCoords: [number, number];
  contactName: string;
  phoneNumber: string;
  email: string;
};

export type LostPetReport = Omit<
  CreatePetReportDTO,
  'locationCoords' | 'location'
> & {
  location?: string;
  locationCoords?: [number, number];
};
