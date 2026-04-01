import type {
  PetImage,
  PetImageDto,
  PetImages,
} from '@domain/repositories/petImage.repository';
import { PetImageResult } from '@domain/repositories/petImage.repository';
import vectorDB from '@infrastructure/database/vectorDB/vectorDatabase';

export const petVector: PetImage = {
  /**
   * Upload image to vector database
   * @param petImage - Object containing image, species and mongoDB id
   * @returns status boolean if the operation was successful or not
   */
  createPetImage: async function (petImage: PetImageDto) {
    const b64 = petImage.image.toString('base64');

    const result = await vectorDB.data
      .creator()
      .withClassName('Pet')
      .withProperties({
        refId: petImage.refId,
        image: b64,
        species: petImage.species,
      })
      .do();

    if (!result) return { status: false };

    return { status: true };
  },

  /**
   * Get images similar to the one requested
   * @param petImage - Object containing image, species and mongoDB id
   * @param offset - Manage pagination
   * @returns result - Array of PetImages, contains image, species and refId
   */
  getSimilarPets: async function (
    petImage: PetImageDto,
    offset: number,
  ): Promise<PetImages[]> {
    const image = petImage.image.toString('base64');
    const resImg = await vectorDB.graphql
      .get()
      .withClassName('Pet')
      .withFields('image refId species')
      .withNearImage({ image: image })
      .withOffset(offset)
      .withLimit(10)
      .do();

    const result: PetImages[] = resImg.data.Get.Pet;

    return result;
  },
};
