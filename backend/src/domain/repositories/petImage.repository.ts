export interface PetImageDto {
  refId?: string;
  image: Buffer;
  species: string;
}

export interface PetImages {
  refId: string;
  image: Buffer;
}

export interface PetImage {
  createPetImage(petImageDto: PetImageDto): Promise<boolean>;
  getSimilarPets(
    petImageDto: PetImageDto,
    offset: number,
  ): Promise<PetImages[]>;
}
