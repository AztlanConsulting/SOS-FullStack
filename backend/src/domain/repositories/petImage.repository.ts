export interface PetImageDto {
  refId?: string;
  image: Buffer;
  species: string;
}

export interface PetImage {
  refId: string;
  image: Buffer;
}

export interface PetVectorRepository {
  createPetImage(petImageDto: PetImageDto): Promise<boolean>;
  getSimilarPets(petImageDto: PetImageDto, offset: number): Promise<PetImage[]>;
  getPetById(refId: string): Promise<PetImage>;
}
