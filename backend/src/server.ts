import dotenv from 'dotenv';
import app from '@/index';
import { mongoDB } from '@infrastructure/database/mongoDB/mongoDB';

dotenv.config();

await mongoDB();

const port = process.env.SERVER_PORT ?? 3000;

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
