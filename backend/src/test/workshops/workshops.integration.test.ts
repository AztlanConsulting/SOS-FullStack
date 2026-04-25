import { clearDatabase, closeDatabase, mongoDB } from '@db/mongoDB/mongoDB';
import app from '../../index';
import request from 'supertest';
import initWorkshopDB from '@db/mongoDB/data/workshops.data';

describe('Workshop integration test', () => {
  // Setup responses
  const workshop = {
    name: 'Taller de entrenar perros para que no se escapen',
    description: 'Perros bien portados',
    price: 100, // MXN;
    content: [
      {
        type: 'text',
        content:
          'Las mascotas necesitan rutina, cariño y atención diaria para mantenerse felices y saludables.',
      },
      {
        type: 'image',
        content:
          'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        type: 'text',
        content:
          'Un perro bien entrenado no solo es más obediente, también es más seguro y feliz en su entorno.',
      },
    ],
    category: ['perros', 'gatos', 'duelo'],
    imageUrl:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.tXOFLzddTwGOR91qug-GDAHaFw%3Fpid%3DApi&f=1&ipt=6ff6e19c1da5466b08ec7fff5af5532289ba77e2d94d5d9aca08862cd1a6b3e8&ipo=images',
  };

  const workshopA = { ...workshop, name: 'A' };
  const workshopZ = { ...workshop, name: 'Z' };
  const workshopExpensive = { ...workshop, price: 5000 };
  const workshopCheap = { ...workshop, price: 50 };
  const workshopSearch = { ...workshop, name: 'Some other thing' };

  const workshops = new Array(30).fill(workshop);
  workshops.push(workshopA);
  workshops.push(workshopZ);
  workshops.push(workshopExpensive);
  workshops.push(workshopCheap);
  workshops.push(workshopSearch);

  beforeAll(async () => {
    await mongoDB('test');
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  // Get an array of 6 workshops and the total amount of documents
  it('Get empty workshops', async () => {
    const res = await request(app).get('/workshop?page=0');
    expect(res.status).toBe(200);
    const data = await res.body;

    // Structure
    expect(data).toHaveProperty('workshops');
    expect(data).toHaveProperty('total');

    // Pagination
    expect(data.workshops.length).toBe(0);
    expect(data.total).toBe(0);
  });

  // Get a different amount of workshops depending on page:
  // page=0 - 6
  // page=5 - 5
  // page=6 - 0
  it('Get workshops', async () => {
    await initWorkshopDB();

    const req = [
      request(app).get('/workshop?page=0'),
      request(app).get('/workshop?page=5'),
      request(app).get('/workshop?page=6'),
    ];

    const res = await Promise.all(req);
    expect(res[0].status).toBe(200);
    expect(res[1].status).toBe(200);
    expect(res[2].status).toBe(200);

    const data = await res.map((r) => r.body);
    const [filled, halfEmpty, empty] = data;
    // Structure
    expect(filled).toHaveProperty('workshops');
    expect(filled).toHaveProperty('total');

    // Pagination
    expect(filled.workshops.length).toBe(6);
    expect(halfEmpty.workshops.length).toBe(5);
    expect(empty.workshops.length).toBe(0);
    expect(filled.total).toBe(35);
    expect(halfEmpty.total).toBe(35);
    expect(empty.total).toBe(35);

    expect(filled.workshops[0]).toMatchObject({
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
    });
  });

  // Get workshops in a sorted manner
  // Workshops sorted by name with extremes A and Z as the name
  // Prices 50 and 5000 as min and max
  it('Get workshops sort filters', async () => {
    const sortOptions = [
      'Nombre (A-Z)',
      'Nombre (Z-A)',
      'Precio: menor a mayor',
      'Precio: mayor a menor',
    ];

    const requests = sortOptions.map((option) =>
      request(app)
        .get(`/workshop?page=0&sortOption=${option}`)
        .then(async (r) => {
          return (await r.body).workshops[0];
        }),
    );
    const data = await Promise.all(requests);
    expect(data[0].name).toBe('A');
    expect(data[1].name).toBe('Z');
    expect(data[2].price).toBe(50);
    expect(data[3].price).toBe(5000);
  });

  it('Get workshop Some other thing', async () => {
    const searchTerm = 'Some other thing';
    const res = await request(app).get(
      `/workshop?page=0&searchTerm=${searchTerm}`,
    );
    expect(res.status).toBe(200);

    const data = await res.body;

    // Structure
    expect(data).toHaveProperty('workshops');
    expect(data).toHaveProperty('total');

    // Pagination
    expect(data.workshops.length).toBe(1);
    expect(data.total).toBe(1);

    expect(data.workshops[0].name).toBe('Some other thing');
  });
});
