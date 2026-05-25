import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Establishes a connection to MongoDB using Mongoose
export const mongoDB = async (enviroment?: string) => {
  try {
    let uri: string =
      process.env.MONGO_URI ?? 'mongodb://localhost:27017/mock-db';

    if (enviroment === 'test') {
      mongoose.set('strictQuery', false);
      mongoServer = await MongoMemoryServer.create({
        instance: { launchTimeout: 60000 },
      });

      uri = mongoServer.getUri();
    }

    await mongoose.connect(uri);
  } catch (error: unknown) {}
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
