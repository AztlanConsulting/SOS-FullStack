// tests/db.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

/**
 * Spin up the in-memory server and connect Mongoose
 */
export const connect = async () => {
  // Prevent Mongoose from throwing strictQuery warnings in Jest
  mongoose.set('strictQuery', false);

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
};

/**
 * Drop database, close the connection, and stop the server
 */
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoose.disconnect();

  if (Boolean(mongoServer)) {
    await mongoServer.stop();
  }
};

/**
 * Remove all data from all collections (useful between tests)
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
