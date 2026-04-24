import request from 'supertest';
import app from '@/index';
import { publishLostPet } from '@/use-cases/clients/publishLostPet.usecase';
import mongoose from 'mongoose';

jest.mock('@/use-cases/clients/publishLostPet.usecase');
jest.mock('@/infrastructure/api/meta.api', () => ({
  metaPublisher: {},
}));

const VALID_FIELDS: Record<string, string> = {
  species: 'Perro',
  date: '2023-10-25',
  sex: 'Macho',
  color: 'Café',
  size: 'Mediana: 11 a 25 kg',
  description: 'Perrito muy amigable, llevaba collar azul.',
  contactName: 'Juan Pérez',
  phoneNumber: '5551234567',
  email: 'juan@example.com',
  locationCoords: '[0,0]',
};

const MOCK_IMAGE = Buffer.from('mock image data');

const buildLostPetRequest = (overrides: Record<string, string> = {}) => {
  const fields = { ...VALID_FIELDS, ...overrides };
  let req = request(app).post('/clients/lost-pet');

  for (const [key, value] of Object.entries(fields)) {
    req = req.field(key, value);
  }

  return req;
};

describe('POST /clients/lost-pet (Integration Tests)', () => {
  beforeAll(async () => {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mock-db';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('replies with 201 and creates the lost pet report successfully', async () => {
    const res = await buildLostPetRequest({ name: 'Firulais' }).attach(
      'images',
      MOCK_IMAGE,
      'perrito.jpg',
    );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Reporte creado exitosamente');
    expect(res.body.data).toHaveProperty('name', 'Firulais');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('status', 'Buscando');
  });

  test('report id starts with lost_pet_', async () => {
    const res = await buildLostPetRequest().attach(
      'images',
      MOCK_IMAGE,
      'perrito.jpg',
    );

    expect(res.status).toBe(201);
    expect(res.body.data.id).toMatch(/^lost_pet_\d+$/);
  });

  test('report has status "Buscando"', async () => {
    const res = await buildLostPetRequest().attach(
      'images',
      MOCK_IMAGE,
      'perrito.jpg',
    );

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('Buscando');
  });

  test('replies with 400 when no pictures are provided', async () => {
    const res = await buildLostPetRequest();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Se requiere al menos una imagen');
  });

  test('replies with 400 when required body fields are missing', async () => {
    const res = await request(app)
      .post('/clients/lost-pet')
      .attach('images', MOCK_IMAGE, 'perrito.jpg');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Datos inválidos');
    expect(res.body.details).toBeDefined();
  });

  test('replies with 400 when species is missing', async () => {
    const { species: _removed, ...fieldsWithoutSpecies } = VALID_FIELDS;

    let req = request(app).post('/clients/lost-pet');
    for (const [key, value] of Object.entries(fieldsWithoutSpecies)) {
      req = req.field(key, value);
    }

    const res = await req.attach('images', MOCK_IMAGE, 'perrito.jpg');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Datos inválidos');
    expect(res.body.details.species).toBeDefined();
  });

  test('replies with 400 when email format is invalid', async () => {
    const res = await buildLostPetRequest({
      email: 'esto-no-es-un-email',
    }).attach('images', MOCK_IMAGE, 'perrito.jpg');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Datos inválidos');
    expect(res.body.details.email).toBeDefined();
  });

  test('replies with 400 when sex value is not one of the allowed options', async () => {
    const res = await buildLostPetRequest({ sex: 'Desconocidísimo' }).attach(
      'images',
      MOCK_IMAGE,
      'perrito.jpg',
    );

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Datos inválidos');
    expect(res.body.details.sex).toBeDefined();
  });

  test('replies with 400 when size value is not one of the allowed options', async () => {
    const res = await buildLostPetRequest({
      size: 'Gigantísimo: más de 200 kg',
    }).attach('images', MOCK_IMAGE, 'perrito.jpg');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Datos inválidos');
    expect(res.body.details.size).toBeDefined();
  });

  test('replies with 400 when contactName is missing', async () => {
    const res = await buildLostPetRequest({ contactName: '' }).attach(
      'images',
      MOCK_IMAGE,
      'perrito.jpg',
    );

    expect(res.status).toBe(400);
    expect(res.body.details.contactName).toBeDefined();
  });
});

describe('POST /clients/publish (Integration Tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('replies with 200 and publishes to social media successfully', async () => {
    (publishLostPet as jest.Mock).mockResolvedValue({
      postId: 'meta_post_123',
    });

    const res = await request(app).post('/clients/publish').send({
      caption: 'Se perdió mi perro Firulais',
      mediaUrl: 'https://example.com/foto.jpg',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Successfully published to Facebook and Instagram',
    );
    expect(res.body.data).toEqual({ postId: 'meta_post_123' });
    expect(publishLostPet).toHaveBeenCalledTimes(1);
  });

  test('calls publishLostPet with the correct imageUrl and caption', async () => {
    (publishLostPet as jest.Mock).mockResolvedValue({});

    await request(app).post('/clients/publish').send({
      caption: 'Mi gato se perdió',
      mediaUrl: 'https://example.com/gato.jpg',
    });

    expect(publishLostPet).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        imageUrl: 'https://example.com/gato.jpg',
        caption: 'Mi gato se perdió',
      }),
    );
  });

  test('replies with 500 when the social media publisher throws an error', async () => {
    (publishLostPet as jest.Mock).mockRejectedValue(
      new Error('Meta API unavailable'),
    );

    const res = await request(app).post('/clients/publish').send({
      caption: 'Se perdió Firulais',
      mediaUrl: 'https://example.com/foto.jpg',
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'error',
      'Error publishing to social media',
    );
    expect(res.body.details).toBe('Meta API unavailable');
  });
});
