import { createLostPetReport } from '@/use-cases/clients/createLostPetReport.usecase';
import type { CreatePetReportDTO } from '../../types/clients.type';

const MOCK_PET_DATA: CreatePetReportDTO = {
  name: 'Firulais',
  species: 'Perro',
  date: '2024-03-09',
  breed: 'Labrador',
  sex: 'Macho',
  color: 'Café',
  size: 'Mediana: 11 a 25 kg',
  description: 'Perrito amigable con collar azul.',
  location: 'Querétaro',
  locationCoords: [20.5888, -100.3899],
  contactName: 'Juan Pérez',
  phoneNumber: '5551234567',
  email: 'juan@example.com',
};

describe('createLostPetReport', () => {
  test('creates a report with an id starting with lost_pet_', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA);

    expect(result.id).toMatch(/^lost_pet_\d+$/);
  });

  test('sets status to "Buscando"', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA);

    expect(result.status).toBe('Buscando');
  });

  test('includes createdAt as a Date', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA);

    expect(result.createdAt).toBeInstanceOf(Date);
  });

  test('keeps the original report data', async () => {
    const result = await createLostPetReport(MOCK_PET_DATA);

    expect(result).toMatchObject(MOCK_PET_DATA);
  });

  test('returns a new report object each time', async () => {
    const result1 = await createLostPetReport(MOCK_PET_DATA);
    const result2 = await createLostPetReport(MOCK_PET_DATA);

    expect(result1).not.toBe(result2);
    expect(result1.status).toBe('Buscando');
    expect(result2.status).toBe('Buscando');
  });
});
