export interface LostPetReport {
  id?: string;
  name: string;
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
