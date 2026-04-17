import { clearDatabase, closeDatabase, mongoDB } from '@db/mongoDB/mongoDB';
import app from '../../index';
import request from 'supertest';
import initWorkshopDB from '@db/mongoDB/data/workshops.data';

describe('Workshop integration test', () => {
  beforeAll(async () => {
    await mongoDB('test');
    await initWorkshopDB();
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  it('Create new workshop', async () => {
    const res = await request(app).get('/workshop?page=0');
    const data = await res.body;
    console.log(data);
    expect(res.status).toBe(200);
  });
});
