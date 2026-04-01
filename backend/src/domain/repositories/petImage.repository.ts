export interface PetImageDto {
  refId?: string;
  image: Buffer;
  species: string;
}

export interface PetImageResult {
  status: boolean;
}

export interface PetImages {
  refId: string;
  image: Buffer;
}

export interface PetImage {
  createPetImage(petImageDto: PetImageDto): Promise<PetImageResult>;
  getSimilarPets(
    petImageDto: PetImageDto,
    offset: number,
  ): Promise<PetImages[]>;
}
