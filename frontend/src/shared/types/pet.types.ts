export type PurchasedPlanResponse = {
  pet: Pet;
  plan: PurchasedPlan;
};

export interface PetLocation {
  coords: [number, number];
  displayName: string;
  properties: {
    city: string;
    country: string;
    state: string;
  };
}

export interface Pet {
  _id: string;
  userId: string;
  name: string;
  species: string;
  dateMissing: Date;
  breed: string;
  sex: string;
  color: string;
  size: string;
  description: string;
  photos: string[];
  location: PetLocation;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchasedPlan {
  _id: string;
  petId: string;
  name: string;
  price: number;
  duration: number; // days
  radius: number; // km
  features: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
