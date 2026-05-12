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
        ...petImage,
        image: b64,
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

    let query = vectorDB.graphql
      .get()
      .withClassName('Pet')
      .withFields('image refId species location color')
      .withNearImage({ image: image, distance: maxDistance })
      .withOffset(0)
      .withLimit(100);

    const resImg = await query.do();

    const allResults: PetImage[] = resImg.data.Get.Pet ?? [];

    const normalize = (str?: string) =>
      str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim() ?? '';

    const filtered = allResults.filter((pet) => {
      const matchesSpecies =
        !species || normalize(pet.species).includes(normalize(species));
      const matchesColor =
        !color || normalize(pet.color).includes(normalize(color));
      const matchesLocation =
        !location || normalize(pet.location).includes(normalize(location));

      return matchesSpecies && matchesColor && matchesLocation;
    });

    const pageNum = page ?? 0;
    return filtered.slice(pageNum * 10, (pageNum + 1) * 10);
  },

  /**
   * Get a particular image
   * @param refId - Get imageInformation by its id
   * @returns petImage - The complete object
   */
  getPetById: async function (refId: string): Promise<PetImage[] | null> {
    console.log(refId);
    const resImg = await vectorDB.graphql
      .get()
      .withClassName('Pet')
      .withFields('image refId species location color')
      .withWhere({
        path: ['refId'],
        operator: 'Like',
        valueString: `*${refId}*`,
      })
      .do();

    const petImage: PetImage[] = resImg.data.Get.Pet;
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

    let query = vectorDB.graphql
      .get()
      .withClassName('Pet')
      .withFields('image refId species location color')
      .withNearImage({ image: image, distance: maxDistance });

    const imgCount = await query.do();

    const allResults: PetImage[] = imgCount.data.Get.Pet ?? [];

    const normalize = (str?: string) =>
      str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim() ?? '';

    const filtered = allResults.filter((pet) => {
      const matchesSpecies =
        !species || normalize(pet.species).includes(normalize(species));
      const matchesColor =
        !color || normalize(pet.color).includes(normalize(color));
      const matchesLocation =
        !location || normalize(pet.location).includes(normalize(location));

      return matchesSpecies && matchesColor && matchesLocation;
    });

    return filtered.length;
  },
};
