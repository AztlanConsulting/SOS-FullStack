import { clearDatabase, closeDatabase, mongoDB } from '@db/mongoDB/mongoDB';
import app from '@/index';
import request from 'supertest';
import initMembersOnlyDB from '@db/mongoDB/data/membersOnly.data';
import { MembersOnlyModel } from '@domain/models/membersOnly.model';

// Minimal valid base64 payloads for POST tests
const VALID_IMAGE_B64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const VALID_PDF_B64 =
  'data:application/pdf;base64,JVBERi0xLjAKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDQKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjIxNgolJUVPRgo=';

describe('membersOnly routes (integration)', () => {
  beforeAll(async () => {
    await mongoDB('test');
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  /**
   * VALIDATION — missing page and id
   * The Zod schema requires either page or id; omitting both yields 400.
   */
  it('GET /members-only without page or id returns 400', async () => {
    const res = await request(app).get('/members-only');
    expect(res.status).toBe(400);
  });

  /**
   * EMPTY DATABASE CASE
   * Verifies API response when no items exist in DB.
   */
  it('GET /members-only returns empty list when DB has no data', async () => {
    const res = await request(app).get('/members-only?page=0');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('membersOnly');
    expect(res.body).toHaveProperty('total');
    expect(res.body.membersOnly.length).toBe(0);
    expect(res.body.total).toBe(0);
  });

  /**
   * PAGINATION BEHAVIOR
   * Seeds 25 items. Verifies page sizes and a consistent total across pages.
   */
  it('GET /members-only supports pagination correctly', async () => {
    await initMembersOnlyDB();

    const responses = await Promise.all([
      request(app).get('/members-only?page=0'),
      request(app).get('/members-only?page=3'),
      request(app).get('/members-only?page=4'),
    ]);

    const [page0, page3, page4] = responses.map((r) => r.body);

    expect(page0.membersOnly.length).toBe(6);
    expect(page3.membersOnly.length).toBe(6);
    expect(page4.membersOnly.length).toBe(1);

    expect(page0.total).toBeGreaterThan(0);
    expect(page3.total).toBe(page0.total);
    expect(page4.total).toBe(page0.total);

    expect(page0.membersOnly[0]).toMatchObject({
      name: expect.any(String),
      duration: expect.any(Number),
      content: expect.any(String),
      imageUrl: expect.any(String),
      pdfUrl: expect.any(String),
    });
  });

  /**
   * SORTING BEHAVIOR
   * Validates ascending vs descending alphabetical ordering.
   * Seed data contains "A - Primer..." and "Z - Ultimo..." to anchor both ends.
   */
  it('GET /members-only supports sorting by name', async () => {
    const [asc, desc] = await Promise.all([
      request(app)
        .get('/members-only?page=0&sortOption=Nombre (A-Z)')
        .then((r) => r.body.membersOnly[0]),
      request(app)
        .get('/members-only?page=0&sortOption=Nombre (Z-A)')
        .then((r) => r.body.membersOnly[0]),
    ]);

    expect(asc.name.localeCompare(desc.name)).toBeLessThan(0);
  });

  /**
   * SEARCH FUNCTIONALITY
   * Ensures filtering by search term returns only matching items.
   */
  it('GET /members-only filters by search term', async () => {
    const res = await request(app).get(
      '/members-only?page=0&searchTerm=acuarios',
    );

    expect(res.status).toBe(200);
    expect(res.body.membersOnly.length).toBe(1);
    expect(res.body.total).toBe(1);
    expect(res.body.membersOnly[0].name.toLowerCase()).toContain('acuarios');
  });

  /**
   * FETCH BY ID — SUCCESS
   * Returns a single item wrapped in the standard envelope.
   */
  it('GET /members-only?id= returns a single item by id', async () => {
    const seeded = await MembersOnlyModel.findOne();
    const id = seeded!._id!.toString();

    const res = await request(app).get(`/members-only?id=${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('membersOnly');
    expect(res.body.membersOnly).toHaveLength(1);
    expect(res.body.total).toBe(1);
    expect(res.body.membersOnly[0].name).toBe(seeded!.name);
  });

  /**
   * FETCH BY ID — NOT FOUND
   * A valid-format but non-existent ObjectId returns 404.
   */
  it('GET /members-only?id= returns 404 for a non-existent id', async () => {
    const res = await request(app).get(
      '/members-only?id=000000000000000000000000',
    );

    expect(res.status).toBe(404);
  });

  /**
   * FILE ENDPOINT — NOT FOUND
   * Requesting a filename that was never uploaded returns 404.
   */
  it('GET /members-only/file/:filename returns 404 for a non-existent file', async () => {
    const res = await request(app).get(
      '/members-only/file/nonexistent-file.pdf',
    );

    expect(res.status).toBe(404);
  });

  /**
   * POST — VALIDATION ERROR
   * Missing required fields (image, pdf) fail Zod validation.
   */
  it('POST /members-only returns 400 with an invalid body', async () => {
    const res = await request(app)
      .post('/members-only')
      .send({ name: '', duration: 0 });

    expect(res.status).toBe(400);
  });

  /**
   * POST — SUCCESS
   * A valid body with base64-encoded image and PDF creates the resource.
   * imageUrl and pdfUrl must reference the internal file endpoint.
   */
  it('POST /members-only creates a new item and returns 201', async () => {
    const body = {
      name: 'Nuevo recurso de prueba',
      duration: 15,
      content: 'Contenido del nuevo recurso',
      image: VALID_IMAGE_B64,
      pdf: VALID_PDF_B64,
    };

    const res = await request(app).post('/members-only').send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('membersOnly');
    expect(res.body.membersOnly.name).toBe(body.name);
    expect(res.body.membersOnly.duration).toBe(body.duration);
    expect(res.body.membersOnly.content).toBe(body.content);
    expect(res.body.membersOnly.imageUrl).toMatch(/^\/members-only\/file\//);
    expect(res.body.membersOnly.pdfUrl).toMatch(/^\/members-only\/file\//);
  });
});
