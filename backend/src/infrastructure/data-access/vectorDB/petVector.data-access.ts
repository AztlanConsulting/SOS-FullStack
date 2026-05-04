import type {
  PetImage,
  PetImageDto,
  PetVectorRepository,
} from '@domain/repositories/petImage.repository';
import vectorDB from '@infrastructure/database/vectorDB/vectorDatabase';

export const petVector: PetVectorRepository = {
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

    if (result == undefined) return false;

    return true;
  },

  /**
   * Get images similar to the one requested
   * @param petImage - Object containing image, species and mongoDB id
   * @param offset - Manage pagination
   * @returns result - Array of PetImage, contains image, species and refId
   */
  getSimilarPets: async function (
    petImage: PetImageDto,
    offset: number,
  ): Promise<PetImage[]> {
    const image = petImage.image.toString('base64');
    const resImg = await vectorDB.graphql
      .get()
      .withClassName('Pet')
      .withFields('image refId species')
      .withNearImage({ image: image })
      .withOffset(offset)
      .withLimit(10)
      .do();

    const result: PetImage[] = resImg.data.Get.Pet;

    return result;
  },

  getPetById: async function (refId: string): Promise<PetImage> {
    const resImg = await vectorDB.graphql
      .get()
      .withClassName('Pet')
      .withFields('image refId species')
      .withWhere({
        path: ['refId'],
        operator: 'Equal',
        valueString: refId,
      })
      .do();

    const petImage: PetImage = resImg.data.Get.Pet;
    return petImage;
  },
};
