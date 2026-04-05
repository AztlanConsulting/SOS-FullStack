import { MongoClient, ServerApiVersion } from 'mongodb';

let client: MongoClient;

export const connectDB = async () => {
  const uri = process.env.DB_URL;

  if (uri === undefined || uri === '') {
    throw new Error('DB_URL is not defined in .env');
  }

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  console.log('Connected to MongoDB');
};

export const getDB = () => {
  if (client === undefined) {
    throw new Error('DB not initialized');
  }
  return client.db();
};
