import type {
  PetImage,
  PetImageSearch,
  PetVectorRepository,
} from '@domain/repositories/petImage.repository';

export default async function getSimilarPets(
  petVector: PetVectorRepository,
  petImage: PetImageSearch,
): Promise<PetImage[]> {
  const response = await petVector.getSimilarPets(
    petImage,
    petImage.query.page!,
  );

  return response;
}
