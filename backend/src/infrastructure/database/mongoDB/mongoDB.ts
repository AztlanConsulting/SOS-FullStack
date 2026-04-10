import mongoose from 'mongoose';

// Establishes a connection to MongoDB using Mongoose
export const mongoDB = async () => {
  try {
    const uri: string =
      process.env.MONGO_URI ?? 'mongodb://localhost:27017/mock-db';

    await mongoose.connect(uri);

    console.log('MongoDB connected');
  } catch (error: unknown) {
    console.error('Error connecting to MongoDB', error);
  }
};
