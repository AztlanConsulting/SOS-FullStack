import type {
  PetImageDto,
  PetVectorRepository,
} from '@domain/repositories/petImage.repository';

export async function createPetImage(
  petVector: PetVectorRepository,
  petImage: PetImageDto,
) {
  const response = await petVector.createPetImage(petImage);

  return response;
}
