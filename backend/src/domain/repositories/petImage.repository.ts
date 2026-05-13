export interface PetImageDto {
  refId?: string;
  image: Buffer;
  species: string;
  location: string;
  color: string;
}

export interface PetImageSearch {
  refId?: string;
  image: Buffer;
  query: {
    page?: number;
    species: string;
    location: string;
    color: string;
  };
}

export interface PetImage {
  refId: string;
  image: Buffer;
  species: string;
  location: string;
  color: string;
  details: string;
}

export interface PetVectorRepository {
  createPetImage(petImageDto: PetImageDto): Promise<boolean>;
  getSimilarPets(
    petImageDto: PetImageSearch,
    offset: number,
  ): Promise<PetImage[]>;
  getPetById(refId: string): Promise<PetImage>;
  countPetImages(petImageDto: PetImageSearch): Promise<number>;
}
