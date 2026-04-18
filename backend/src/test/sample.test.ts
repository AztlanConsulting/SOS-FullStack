// tests/sample.test.ts
import mongoose from 'mongoose';
import {
  mongoDB,
  closeDatabase,
  clearDatabase,
} from '@infrastructure/database/mongoDB/mongoDB';

// Define a simple Mongoose Schema and Model for testing
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
});

// Use existing model if it exists (prevents Jest watch mode overwrite errors), otherwise create it
const User = mongoose.models.User || mongoose.model('User', userSchema);

// 1. Connect before any tests run
beforeAll(async () => {
  await mongoDB('test');
});

// 2. Clear out data between each test
afterEach(async () => {
  await clearDatabase();
});

// 3. Close the server when completely done
afterAll(async () => {
  await closeDatabase();
});

describe('Mongoose In-Memory Database', () => {
  it('should successfully create and retrieve a document', async () => {
    // Arrange & Act: Create the document
    const user = await User.create({ name: 'Grace Hopper', role: 'Engineer' });

    // Act: Retrieve the document
    const foundUser = await User.findById(user._id);

    // Assert
    expect(foundUser).toBeDefined();
    expect(foundUser?.name).toBe('Grace Hopper');
    expect(foundUser?.role).toBe('Engineer');
  });

  it('should start with a clean slate for the next test', async () => {
    // Act: Try to find the user from the previous test
    const missingUser = await User.findOne({ name: 'Grace Hopper' });

    // Assert: It should be null because of `clearDatabase`
    expect(missingUser).toBeNull();
  });
});
