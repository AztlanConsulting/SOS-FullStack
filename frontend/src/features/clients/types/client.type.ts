export type PlanStatus = 'continua' | 'casi expira' | 'expirado' | 'RIP';

export interface ClientPet {
  _id: string;
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  color?: string;
  size?: string;
  description?: string;
  photos?: string[];
  dateMissing?: Date;
  placeMissing?: string;
}

export interface ClientPlan {
  _id: string;
  name: string;
  status: PlanStatus;
  price?: number;
  duration?: number;
  radius?: number;
  feautures?: string[];
  expirationDate?: string;
}

export interface ClientListItem {
  _id: string;
  username: string;
  email: string;
  phone: string;
  description?: string;
  conversation?: string;
  pet?: Pick<ClientPet, '_id' | 'name' | 'species' | 'description'>;
  plan?: ClientPlan;
}

export interface ClientDetail {
  _id: string;
  username: string;
  email: string;
  phone: string;
  conversation?: string;
  fbUser?: string;
  active?: boolean;
  createdAt: string;
  pets: ClientPet[];
  plans: ClientPlan[];
}

export interface ClientListResponse {
  clients: ClientListItem[];
  total: number;
  page: number;
  totalPages: number;
}
