import app from '@/index';
import { WorkshopModel } from '@/domain/models/workshop.model';
import { ManualModel } from '@/domain/models/manual.model';
import { clearDatabase, closeDatabase, mongoDB } from '@db/mongoDB/mongoDB';
import request from 'supertest';

/**
 * Integration tests for POST /workshop-item
 * Verifies controller validation, routing, and MongoDB persistence.
 */
describe('POST /workshop-item integration tests', () => {
  beforeAll(async () => {
    await mongoDB('test');
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  // ── Taller ──────────────────────────────────────────────────────────────────

  describe('type: taller', () => {
    const validTallerPayload = {
      type: 'taller',
      name: 'Taller de integración',
      price: 500,
      imageUrl: 'https://example.com/image.jpg',
      description: 'Descripción del taller',
      videoUrl: 'https://example.com/video.mp4',
      emailContent: 'Gracias por tu compra',
      content: [
        { type: 'texto', content: 'Bloque de texto' },
        { type: 'imagen', content: 'https://image.com' },
        { type: 'link', content: 'https://example.com' },
      ],
      category: ['test'],
    };

    test('creates a taller and saves it in MongoDB', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send(validTallerPayload);

      expect(response.status).toBe(201);
      expect(response.body.type).toBe('taller');
      expect(response.body.id).toBeDefined();

      const saved = await WorkshopModel.findById(response.body.id).lean();
      expect(saved).toBeDefined();
      expect(saved?.name).toBe('Taller de integración');
      expect(saved?.price).toBe(500);
      expect(saved?.content).toHaveLength(3);
      expect(saved?.content[0].type).toBe('text');
      expect(saved?.content[1].type).toBe('image');
      expect(saved?.content[2].type).toBe('text');
    });

    test('returns 400 when name is missing', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({ ...validTallerPayload, name: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('El nombre es requerido');
    });

    test('returns 400 when price is zero', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({ ...validTallerPayload, price: 0 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'El precio debe ser un número positivo',
      );
    });

    test('returns 400 when price exceeds maximum', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({ ...validTallerPayload, price: 100_000 });

      expect(response.status).toBe(400);
    });

    test('returns 400 when imageUrl is missing', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({ ...validTallerPayload, imageUrl: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('imageUrl es requerido');
    });

    test('returns 400 when description is missing for taller', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({ ...validTallerPayload, description: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'description es requerido para talleres',
      );
    });

    test('returns 400 when content exceeds 10 blocks', async () => {
      const blocks = Array.from({ length: 11 }, (_, i) => ({
        type: 'texto',
        content: `Bloque ${i}`,
      }));

      const response = await request(app)
        .post('/workshop-item')
        .send({ ...validTallerPayload, content: blocks });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('10 bloques');
    });

    test('returns 400 for invalid block type', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({
          ...validTallerPayload,
          content: [{ type: 'invalid_type', content: 'abc' }],
        });

      expect(response.status).toBe(400);
    });

    test('saves taller without optional content blocks', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({ ...validTallerPayload, content: [] });

      expect(response.status).toBe(201);

      const saved = await WorkshopModel.findById(response.body.id).lean();
      expect(saved?.content).toHaveLength(0);
    });

    test('content type field is persisted correctly in MongoDB', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send(validTallerPayload);

      const saved = await WorkshopModel.findById(response.body.id).lean();
      saved?.content.forEach((block) => {
        expect(block.type).toBeDefined();
        expect(['text', 'image', 'link']).toContain(block.type);
      });
    });
  });

  // ── Manual ──────────────────────────────────────────────────────────────────

  describe('type: manual', () => {
    const validManualPayload = {
      type: 'manual',
      name: 'Manual de integración',
      price: 200,
      imageUrl: 'https://example.com/image.jpg',
      pdfUrl: 'https://example.com/manual.pdf',
      content: [{ type: 'texto', content: 'Contenido del manual' }],
    };

    test('creates a manual and saves it in MongoDB', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send(validManualPayload);

      expect(response.status).toBe(201);
      expect(response.body.type).toBe('manual');
      expect(response.body.id).toBeDefined();

      const saved = await ManualModel.findById(response.body.id).lean();
      expect(saved).toBeDefined();
      expect(saved?.name).toBe('Manual de integración');
      expect(saved?.price).toBe(200);
      expect(saved?.content[0].type).toBe('text');
    });

    test('returns 400 when name is missing', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({ ...validManualPayload, name: '' });

      expect(response.status).toBe(400);
    });

    test('returns 400 when price is negative', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({ ...validManualPayload, price: -10 });

      expect(response.status).toBe(400);
    });

    test('saves manual without pdfUrl when not provided', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({ ...validManualPayload, pdfUrl: undefined });

      expect(response.status).toBe(201);

      const saved = await ManualModel.findById(response.body.id).lean();
      expect(saved?.pdfUrl).toBeUndefined();
    });
  });

  // ── Invalid type ─────────────────────────────────────────────────────────────

  describe('invalid type', () => {
    test('returns 400 for unknown type', async () => {
      const response = await request(app)
        .post('/workshop-item')
        .send({ type: 'curso', name: 'Test', price: 100 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('type debe ser "manual" o "taller"');
    });
  });
});
