import { clearDatabase, closeDatabase, mongoDB } from '@db/mongoDB/mongoDB';
import request from 'supertest';
import app from '@/index';

import { WorkshopModel } from '@/domain/models/workshop.model';
import { ManualModel } from '@/domain/models/manual.model';

jest.mock('@interfaces/middleware/auth.middleware', () => ({
  authMiddleware: (_req: unknown, _res: unknown, next: () => void) => next(),
  requirePermission: () => (_req: unknown, _res: unknown, next: () => void) =>
    next(),
}));

describe('Update resource integration test', () => {
  let workshopId: string;
  let manualId: string;

  beforeAll(async () => {
    await mongoDB('test');

    const workshop = await WorkshopModel.create({
      name: 'Workshop',
      description: 'Description',
      price: 100,
      content: [],
      category: ['dogs'],
      imageUrl: 'image.jpg',
      videoUrl: 'http://example.test',
      emailContent: 'This is the example email content',
    });

    const manual = await ManualModel.create({
      name: 'Manual',
      price: 50,
      content: [
        { content: 'Hello there', type: 'text' },
        { content: 'http://example_image.test', type: 'image' },
      ],
      pdfUrl: 'manual.pdf',
      imageUrl: 'image.jpg',
    });

    workshopId = workshop._id.toString();
    manualId = manual._id.toString();
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  it('update workshop successfully', async () => {
    const res = await request(app).put(`/resources?resource=workshop`).send({
      _id: workshopId,
      name: 'Updated Workshop',
      price: 200,
    });

    expect(res.status).toBe(200);

    const updated = await WorkshopModel.findById(workshopId);

    expect(updated?.name).toBe('Updated Workshop');
    expect(updated?.price).toBe(200);
  });

  it('update manual successfully', async () => {
    const res = await request(app).put(`/resources?resource=manual`).send({
      _id: manualId,
      name: 'Updated Manual',
      price: 250,
    });

    expect(res.status).toBe(200);

    const updated = await ManualModel.findById(manualId);

    expect(updated?.name).toBe('Updated Manual');
    expect(updated?.price).toBe(250);
  });

  it('request without resource param', async () => {
    const res = await request(app).put('/resources').send({
      _id: '507f1f77bcf86cd799439011',
      name: 'Does not exist',
    });

    expect(res.status).toBe(401);

    expect(res.text).toBe(
      "Couldn't find repository. Query must be [workshop | manual]",
    );
  });

  it('error updating non-existent workshop', async () => {
    const res = await request(app).put('/resources?resource=manual').send({
      _id: '507f1f77bcf86cd799439011',
      name: 'Does not exist',
    });

    expect(res.status).toBe(404);

    expect(res.text).toBe("Couldn't find object");
  });

  it('error updating non-existent manual', async () => {
    const res = await request(app).put('/resources?resource=workshop').send({
      _id: '507f1f77bcf86cd799439011',
      name: 'Does not exist',
    });

    expect(res.status).toBe(404);

    expect(res.text).toBe("Couldn't find object");
  });
});
