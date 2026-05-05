import type {
  PetImageDto,
  PetImageSearch,
  PetVectorRepository,
} from '@domain/repositories/petImage.repository';

export default async function getSimilarPets(
  petVector: PetVectorRepository,
  petImage: PetImageSearch,
) {
  const response = await petVector.getSimilarPets(
    petImage,
    petImage.query.page!,
  );

  return response;
}
