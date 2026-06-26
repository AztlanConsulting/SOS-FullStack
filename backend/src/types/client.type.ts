/**
 * Global types for the Client Management module.
 * These types define the structure for data flowing between the API
 * and the User Interface.
 */
export type PlanStatus = 'continua' | 'casi expira' | 'expirada' | 'RIP';

/**
 * Public note visible to the client, containing optional text and image URL.
 */
export interface PublicNote {
  text?: string;
  image?: string;
}

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
  dateMissing?: string;
  placeMissing?: string;
  notes?: string;
  publicNote?: { text?: string; image?: string };
  location?: {
    coords: [number, number];
    displayName: string;
    properties: {
      city: string;
      country: string;
      state: string;
    };
  };
  plans?: ClientPlan[];
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
  features?: string[];
  expirationDate?: string;
  createdAt?: string;
}

/**
 * Data structure for an individual row in the Client List view.
 * Uses 'Pick' to only include necessary pet and plan metadata for UI performance.
 */
export interface ClientListItem {
  _id: string;
  username: string;
  email: string;
  phone: string;
  conversation?: string;
  createdAt?: string;
  pet?: Pick<ClientPet, '_id' | 'name' | 'description'>;
  plan?: Pick<ClientPlan, '_id' | 'name' | 'status' | 'createdAt'>;
}

/**
 * Complete profile of a client used in the Detail View/Modal.
 * Includes full history of pets and purchased plans, plus admin metadata.
 */
export interface ClientDetail {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  fbUser?: string;
  conversation?: string;
  notes?: string;
  publicNote?: { text?: string; image?: string };
  createdAt?: string;
  paymentMethod?: string;
  pets: ClientPet[];
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
