import { createLostPetReport } from '@/use-cases/clients/createLostPetReport.usecase';
import { createPetImage } from '@/use-cases/images/createPetImage';
import type { LostPetReport } from '@/domain/models/lostPet.model';
import type { Readable } from 'stream';

jest.mock('@/use-cases/images/createPetImage');
jest.mock('@interfaces/data-access/vectorDB/petVector.data-access', () => ({
  petVector: {},
}));

const MOCK_PET_DATA: LostPetReport = {
  species: 'Perro',
  date: '2023-10-25',
  sex: 'Macho',
  color: 'Café',
  size: 'Mediana: 11 a 25 kg',
  description: 'Perro amigable con collar azul',
  contactName: 'Juan Pérez',
  phoneNumber: '5551234567',
  email: 'juan@example.com',
};

/**
 * Create an minimal Multer.File object with real buffer.
 * Only the fields used by the use case (buffer) are mandatory.
 */
const makeFile = (name: string): Express.Multer.File => ({
  fieldname: 'images',
  originalname: name,
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from(`fake image data for ${name}`),
  size: 100,
  stream: undefined as unknown as Readable,
  destination: '',
  filename: name,
  path: '',
});

describe('createLostPetReport use case (Unit Tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createPetImage as jest.Mock).mockResolvedValue(true);
  });

  test('returns a report with an id starting with "lost_pet_"', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA, [
      makeFile('foto.jpg'),
    ]);
    expect(result.id).toMatch(/^lost_pet_\d+$/);
  });

  test('returned report contains all pet data fields', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA, [
      makeFile('foto.jpg'),
    ]);

    expect(result.species).toBe('Perro');
    expect(result.color).toBe('Café');
    expect(result.email).toBe('juan@example.com');
    expect(result.contactName).toBe('Juan Pérez');
  });

  test('returned report has status "Buscando"', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA, [
      makeFile('foto.jpg'),
    ]);
    expect(result.status).toBe('Buscando');
  });

  test('returned report has createdAt as a Date object', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA, [
      makeFile('foto.jpg'),
    ]);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  test('each call generates a unique id (different timestamps)', async () => {
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(2000);

    const result1 = await createLostPetReport(MOCK_PET_DATA, [
      makeFile('f1.jpg'),
    ]);
    const result2 = await createLostPetReport(MOCK_PET_DATA, [
      makeFile('f2.jpg'),
    ]);

    expect(result1.id).not.toBe(result2.id);
  });

  test('returns imagesUploaded: true when all images upload successfully', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA, [
      makeFile('foto.jpg'),
    ]);
    expect(result.imagesUploaded).toBe(true);
  });

  test('calls createPetImage once for a single image', async () => {
    await createLostPetReport(MOCK_PET_DATA, [makeFile('foto.jpg')]);
    expect(createPetImage).toHaveBeenCalledTimes(1);
  });

  test('calls createPetImage once per each image when multiple are provided', async () => {
    await createLostPetReport(MOCK_PET_DATA, [
      makeFile('foto1.jpg'),
      makeFile('foto2.jpg'),
      makeFile('foto3.jpg'),
    ]);
    expect(createPetImage).toHaveBeenCalledTimes(3);
  });

  test('calls createPetImage with the correct refId and species', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA, [
      makeFile('foto.jpg'),
    ]);

    expect(createPetImage).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        refId: result.id,
        species: 'Perro',
      }),
    );
  });

  test('calls createPetImage with the image buffer', async () => {
    const file = makeFile('foto.jpg');
    await createLostPetReport(MOCK_PET_DATA, [file]);

    expect(createPetImage).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ image: file.buffer }),
    );
  });

  test('does not call createPetImage when images array is empty', async () => {
    await createLostPetReport(MOCK_PET_DATA, []);
    expect(createPetImage).not.toHaveBeenCalled();
  });

  test('returns imagesUploaded: false when images array is empty', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA, []);
    expect(result.imagesUploaded).toBe(false);
  });

  test('does not throw when vector DB upload fails', async () => {
    (createPetImage as jest.Mock).mockRejectedValue(
      new Error('Vector DB down'),
    );
    await expect(
      createLostPetReport(MOCK_PET_DATA, [makeFile('foto.jpg')]),
    ).resolves.toBeDefined();
  });

  test('returns imagesUploaded: false when vector DB upload fails', async () => {
    (createPetImage as jest.Mock).mockRejectedValue(
      new Error('Vector DB down'),
    );
    const result = await createLostPetReport(MOCK_PET_DATA, [
      makeFile('foto.jpg'),
    ]);
    expect(result.imagesUploaded).toBe(false);
  });

  test('still returns the full report when vector DB fails', async () => {
    (createPetImage as jest.Mock).mockRejectedValue(
      new Error('Vector DB down'),
    );
    const result = await createLostPetReport(MOCK_PET_DATA, [
      makeFile('foto.jpg'),
    ]);

    expect(result.id).toMatch(/^lost_pet_/);
    expect(result.status).toBe('Buscando');
    expect(result.species).toBe('Perro');
  });
});
