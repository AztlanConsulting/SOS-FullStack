import type {
  PetImageDto,
  PetVectorRepository,
} from '@domain/repositories/petImage.repository';

export default async function getSimilarPets(
  petVector: PetVectorRepository,
  page: number,
  petImage: Partial<PetImageDto>,
) {
  const response = await petVector.getSimilarPets(petImage, page);

  return response;
}
