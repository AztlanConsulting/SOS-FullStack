import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { mongoDB } from '@infrastructure/database/mongoDB/mongoDB';
import importRealContentDB from './real-content.data';

dotenv.config();

try {
  await mongoDB(process.env.ENV);
  await importRealContentDB();
  await mongoose.connection.close();
  await mongoose.disconnect();

  process.exit(0);
} catch (error) {
  console.error(error);
  await mongoose.connection.close().catch(() => {});
  await mongoose.disconnect().catch(() => {});

  process.exit(1);
}
