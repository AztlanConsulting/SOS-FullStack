export interface PetImageDto {
  refId?: string;
  image: Buffer;
  species: string;
  location: string;
  color: string;
}

export interface PetImage {
  refId: string;
  image: Buffer;
}

export interface PetVectorRepository {
  createPetImage(petImageDto: PetImageDto): Promise<boolean>;
  getSimilarPets(
    petImageDto: Partial<PetImageDto>,
    offset: number,
  ): Promise<PetImage[]>;
  getPetById(refId: string): Promise<PetImage>;
}
