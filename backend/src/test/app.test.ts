import request from 'supertest';
import app from '../index';

test('test server', async () => {
  const res = await request(app).get('/health');

  expect(res.status).toBe(200);
});
