import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '@/index';
import { mongoDB } from '@infrastructure/database/mongoDB/mongoDB';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

await mongoDB();

const port = process.env.SERVER_PORT ?? 3000;

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
