import { clearDatabase, closeDatabase, mongoDB } from '@db/mongoDB/mongoDB';
import app from '@/index';
import request from 'supertest';
import initBlogDB from '@db/mongoDB/data/blogs.data';

describe('blog routes (integration)', () => {
  beforeAll(async () => {
    // Connect to in-memory MongoDB before running tests
    await mongoDB('test');
  });

  afterAll(async () => {
    // Clean database and close connection after all tests
    await clearDatabase();
    await closeDatabase();
  });

  /**
   * EMPTY DATABASE CASE
   * Verifies API response when no blogs exist in DB.
   */
  it('GET /blog returns empty list when DB has no data', async () => {
    const res = await request(app).get('/blog?page=0');

    expect(res.status).toBe(200);

    const data = res.body;

    expect(data).toHaveProperty('blogs');
    expect(data).toHaveProperty('total');

    expect(data.blogs.length).toBe(0);
    expect(data.total).toBe(0);
  });

  /**
   * PAGINATION BEHAVIOR
   * Ensures API correctly paginates results
   * and returns consistent total across pages.
   */
  it('GET /blog supports pagination correctly', async () => {
    // Seed database with test blogs
    await initBlogDB();

    const requests = [
      request(app).get('/blog?page=0'),
      request(app).get('/blog?page=3'),
      request(app).get('/blog?page=4'),
    ];

    const res = await Promise.all(requests);

    const [page0, page3, page4] = res.map((r) => r.body);

    expect(page0.blogs.length).toBe(6);
    expect(page3.blogs.length).toBe(6);
    expect(page4.blogs.length).toBe(1);

    expect(page0.total).toBeGreaterThan(0);
    expect(page3.total).toBe(page0.total);
    expect(page4.total).toBe(page0.total);

    expect(page0.blogs[0]).toMatchObject({
      name: expect.any(String),
      duration: expect.any(Number),
      content: expect.any(Array),
      imageUrl: expect.any(String),
    });
  });

  /**
   * SORTING BEHAVIOR
   * Validates ascending vs descending alphabetical order.
   */
  it('GET /blog supports sorting by name', async () => {
    const sortOptions = ['Nombre (A-Z)', 'Nombre (Z-A)'];

    const requests = sortOptions.map((option) =>
      request(app)
        .get(`/blog?page=0&sortOption=${option}`)
        .then((r) => r.body.blogs[0]),
    );

    const [asc, desc] = await Promise.all(requests);

    // First element in ASC should come before DESC alphabetically
    expect(asc.name.localeCompare(desc.name)).toBeLessThan(0);
  });

  /**
   * SEARCH FUNCTIONALITY
   * Ensures filtering by search term works correctly.
   */
  it('GET /blog filters blogs by search term', async () => {
    const searchTerm = 'acuarios';

    const res = await request(app).get(`/blog?page=0&searchTerm=${searchTerm}`);

    expect(res.status).toBe(200);

    const data = res.body;

    expect(data.blogs.length).toBe(1);
    expect(data.total).toBe(1);

    expect(data.blogs[0].name.toLowerCase()).toContain(searchTerm);
  });
});
