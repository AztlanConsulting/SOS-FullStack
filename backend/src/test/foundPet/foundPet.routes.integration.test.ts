import express from 'express';
import request from 'supertest';
import foundPetRoutes from '@interfaces/routes/foundPet.routes';
import { connect, closeDatabase, clearDatabase } from '../db';

jest.mock(
  '@/infrastructure/data-access/vectorDB/petVector.data-access',
  () => ({
    petVector: {
      createPetImage: jest.fn().mockResolvedValue(true),
      getSimilarPets: jest.fn().mockResolvedValue([]),
    },
  }),
);

jest.mock('@use-cases/images/createPetImage', () => ({
  createPetImage: jest.fn().mockResolvedValue(true),
}));

const IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAADUlEQVR42mP8z/C/HwAFgwJ/lxXH3wAAAABJRU5ErkJggg==';

describe('foundPet routes (integration)', () => {
  const app = express();
  app.use(express.json());
  app.use('/found-pets', foundPetRoutes);

  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('POST /found-pets/report returns 201 with created data', async () => {
    const validPayload = {
      species: 'Perro',
      date: '2024-03-15',
      breed: 'Labrador',
      sex: 'Macho',
      color: 'Dorado',
      size: 'Mediana: 11 a 25 kg',
      description: 'Perro amigable con collar rojo',
      location: 'Parque Central',
      locationCoords: [-99.1332, 19.4326],
      contactName: 'Juan Perez',
      phoneNumber: '+521234567890',
      email: 'juan@example.com',
      images: [IMAGE],
    };

    const res = await request(app)
      .post('/found-pets/report')
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
  });

  test('POST /found-pets/report returns 400 when required fields missing', async () => {
    const invalidPayload = {
      color: 'Dorado',
    };

    const res = await request(app)
      .post('/found-pets/report')
      .send(invalidPayload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
