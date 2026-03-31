export interface PetImageDto {
  refId: string;
  image: Buffer;
  species: string;
}

export interface PetImageResult {
  status: boolean;
}

export interface PetImage {
  createPetImage(petImageDto: PetImageDto): Promise<PetImageResult>;
}
