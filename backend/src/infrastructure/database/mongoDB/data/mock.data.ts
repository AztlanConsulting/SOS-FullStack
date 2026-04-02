import { mongoDB } from '../mongoDB';
import { Mock } from '../../../../domain/models/mock.model';

// Temporary mock data used for architectural validation.
// This is not part of the final data and will be removed in future iterations.

try {
  await mongoDB();

  await Mock.deleteMany({});

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

  console.log('Mock data seeded successfully');
  process.exit(0);
} catch (error: unknown) {
  console.error('Error seeding mock data:', error);
  process.exit(1);
}
