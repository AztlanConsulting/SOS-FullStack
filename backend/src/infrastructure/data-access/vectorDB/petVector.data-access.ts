import type {
  PetImage,
  PetImageDto,
  PetImageSearch,
  PetVectorRepository,
} from '@domain/repositories/petImage.repository';
import vectorDB from '@infrastructure/database/vectorDB/vectorDatabase';

const maxDistance = 0.18;

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
    petImage: PetImageSearch,
  ): Promise<PetImage[]> {
    const image = petImage.image.toString('base64');
    const { page, color, species, location } = petImage.query;

    const operands: any[] = [];
    if (species)
      operands.push({
        path: ['species'],
        operator: 'Equal',
        valueString: species,
      });
    if (color)
      operands.push({ path: ['color'], operator: 'Equal', valueString: color });
    if (location)
      operands.push({
        path: ['location'],
        operator: 'Equal',
        valueString: location,
      });

    let query = vectorDB.graphql
      .get()
      .withClassName('Pet')
      .withFields('image refId species location color details')
      .withNearImage({ image: image, distance: maxDistance })
      .withOffset(page! * 10)
      .withLimit(10);

    if (operands.length > 0) {
      query = query.withWhere({
        operator: 'And',
        operands: operands,
      });
    }

    const resImg = await query.do();

    const result: PetImage[] = resImg.data.Get.Pet;

    return result;
  },

  /**
   * Get a particular image
   * @param refId - Get imageInformation by its id
   * @returns petImage - The complete object
   */
  getPetById: async function (refId: string): Promise<PetImage> {
    const resImg = await vectorDB.graphql
      .get()
      .withClassName('Pet')
      .withFields('image refId species location color details')
      .withWhere({
        path: ['refId'],
        operator: 'Equal',
        valueString: refId,
      })
      .do();

    const petImage: PetImage = resImg.data.Get.Pet;
    return petImage;
  },

  /**
   * Get the total amount of images similar to the one requested
   * @param petImage - Object containing image, species and mongoDB id
   * @returns number - Amount of images
   */
  countPetImages: async function (petImage: PetImageSearch): Promise<number> {
    const image = petImage.image.toString('base64');
    const { color, species, location } = petImage.query;

    const operands: any[] = [];
    if (species)
      operands.push({
        path: ['species'],
        operator: 'Equal',
        valueString: species,
      });
    if (color)
      operands.push({ path: ['color'], operator: 'Equal', valueString: color });
    if (location)
      operands.push({
        path: ['location'],
        operator: 'Equal',
        valueString: location,
      });

    let query = vectorDB.graphql
      .get()
      .withClassName('Pet')
      .withFields('image refId species location color details')
      .withNearImage({ image: image, distance: maxDistance });
    // .withNearImage({ image: image }

    if (operands.length > 0) {
      query = query.withWhere({
        operator: 'And',
        operands: operands,
      });
    }

    const imgCount = await query.do();
    const length = imgCount.data.Get.Pet.length;

    return length;
  },
};
