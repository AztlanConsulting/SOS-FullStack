import type { PetImageSearch } from './../../domain/repositories/petImage.repository';
import type {
  PetImage,
  PetVectorRepository,
} from '@/domain/repositories/petImage.repository';
import countPetImages from '@/use-cases/images/countPetImages.usecase';
import getSimilarPets from '@/use-cases/images/getSimilarPets';

const mockPetImg: PetImage = {
  refId: 'refId',
  image: Buffer.from('ImageInformation'),
  species: 'Dog',
  location: 'Qro',
  color: 'Brown',
  details: 'Good boy',
};

const mockPetImages: PetImage[] = new Array(14).fill(mockPetImg);
mockPetImages[11] = { ...mockPetImages[11], refId: 'refId2' };

const fakeRepo = {
  getSimilarPets: jest.fn((_, page) =>
    Promise.resolve(mockPetImages.slice(page * 10, page * 10 + 10)),
  ),
  countPetImages: jest.fn().mockResolvedValue(mockPetImages.length),
} as unknown as PetVectorRepository;

describe('Pet vector database collection test (unit)', () => {
  const mockSearch: PetImageSearch = {
    image: mockPetImages[0].image,
    query: {
      page: 0,
      species: 'dog',
      location: 'queretaro',
      color: 'brown',
    },
  };

  it('get pet images page 0 -> 10', async () => {
    const response = await getSimilarPets(fakeRepo, mockSearch);

    expect(fakeRepo.getSimilarPets).toHaveBeenCalledWith(mockSearch, 0);
    expect(response).toEqual(mockPetImages.slice(0, 10));
    expect(response[0]).toHaveProperty('refId');
    expect(response[0]).toHaveProperty('species');
    expect(response[0]).toHaveProperty('image');
  });

  it('get pet images page 1 -> 4', async () => {
    mockSearch.query.page = 1;
    const response = await getSimilarPets(fakeRepo, mockSearch);

    expect(fakeRepo.getSimilarPets).toHaveBeenCalledWith(mockSearch, 1);
    console.log(response);
    expect(response).toEqual(mockPetImages.slice(10, 20));
    expect(response[1].refId).toEqual('refId2');
  });

  it('get total records - 14', async () => {
    const response = await countPetImages(fakeRepo, mockSearch);

    expect(fakeRepo.countPetImages).toHaveBeenCalledWith(mockSearch);
    expect(response).toEqual(mockPetImages.length);
  });
});
