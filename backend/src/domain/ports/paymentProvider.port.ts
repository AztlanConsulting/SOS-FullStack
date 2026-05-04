import type { Stripe } from 'stripe';

export interface GeocodingResult {
  coords: [number, number];
  displayName: string; // Contains the name of the location
}

export interface PetReportData {
  name: string;
  species: string;
  date: string;
  breed: string;
  sex: '' | 'Macho' | 'Hembra' | 'Desconocido';
  color: string;
  size?:
    | ''
    | 'Mini: 1 a 4 kg'
    | 'Pequeña: 5 a 10 kg'
    | 'Mediana: 11 a 25 kg'
    | 'Grande: 26 a 45 kg'
    | 'Gigante: más de 45 kg';
  description?: string;

  // images: File[];
  imageLayout: string;

  address: string;
  location: GeocodingResult | null;
  locationCoords?: [number, number];

  contactName: string;
  phoneNumber: string;
  email: string;

  planName: string;
  planDetails?: {
    days: number;
    km: number;
    selectedFeatures: string[];
    totalPrice: number;
  };
}

export interface PaymentIntentDTO {
  amount: number;
  currency: string;
  customerId?: string; // for SPEI
  method?: string; // to seperate spei from the other methods
  product?: {
    productName: string;
    productId: string;
  };
  plan?: PetReportData;
}

export interface PaymentIntentResult {
  id: string;
  amount: number;
  currency: string;
  clientSecret: string | null;
}

export interface EventDTO {
  payload: string | Buffer;
  sig: string;
  secret: string;
}

export interface PaymentProvider {
  createIntent(data: PaymentIntentDTO): Promise<PaymentIntentResult>;
  constructEvent(data: EventDTO): Promise<Stripe.Event>;
}
