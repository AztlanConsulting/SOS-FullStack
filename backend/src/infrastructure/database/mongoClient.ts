import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.DB_URL;

  if (uri === undefined || uri === '') {
    throw new Error('DB_URL is not defined in .env');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
};

export const getDB = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('DB not initialized');
  }
  return mongoose.connection;
};
