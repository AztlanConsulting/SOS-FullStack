/**
 * Global types for the Client Management module.
 * These types define the structure for data flowing between the API
 * and the User Interface.
 */
export type PlanStatus = 'continua' | 'casi expira' | 'expirado' | 'RIP';

/**
 * Detailed information about a pet belonging to a client.
 */
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

/**
 * Configuration and metadata of a plan purchased by a client.
 */
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

/**
 * Data structure for an individual row in the Client List view.
 * Uses 'Pick' to only include necessary pet metadata for performance.
 */
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

/**
 * Complete profile of a client used in the Detail View/Modal.
 * Includes full history of pets and purchased plans.
 */
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

/**
 * Standardized API response for paginated client listings.
 */
export interface ClientListResponse {
  clients: ClientListItem[];
  total: number;
  page: number;
  totalPages: number;
}
