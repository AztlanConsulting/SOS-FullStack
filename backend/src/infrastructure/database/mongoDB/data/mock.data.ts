import { mongoDB } from '@infrastructure/database/mongoDB/mongoDB';
import { Mock } from '@domain/models/mock.model';
import { PlanModel } from '@domain/models/plan.model';

// Temporary mock data used for testing.
// This is not part of the final data.

try {
  await mongoDB();

  // Clean collections
  await Mock.deleteMany({});
  await PlanModel.deleteMany({});

  // Mock data
  await Mock.insertMany([
    {
      title: 'Mock Item 1',
      description: 'This is a test item',
      value: 100,
    },
    {
      title: 'Mock Item 2',
      description: 'Another test item',
      value: 200,
    },
    {
      title: 'Mock Item 3',
      description: 'More mock data',
      value: 300,
    },
  ]);

  // Plans data
  await PlanModel.insertMany([
    {
      name: 'Básico',
      price: 9.99,
    },
    {
      name: 'Estándar',
      price: 19.99,
    },
    {
      name: 'Premium',
      price: 29.99,
    },
  ]);

  console.log('Data seeded successfully');
  process.exit(0);
} catch (error: unknown) {
  console.error('Error seeding data:', error);
  process.exit(1);
}
