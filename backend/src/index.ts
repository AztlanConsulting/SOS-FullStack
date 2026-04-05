import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// loading .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import bodyparser from 'body-parser';
import { connectDB } from './infrastructure/database/mongoClient';

// Dynamic import for routes to ensure dotenv.config() has finished loading variables.
const { default: routes } = await import('./interfaces/routes/routes');

// Start app
const app = express();

app.use(bodyparser.json());
app.use('/', routes);

const port = process.env.SERVER_PORT ?? 3000;

async function start() {
  await connectDB();
}

app.listen(port, () => {
  start().catch((err) => console.error('Failed to connect to DB:', err));
  console.log(`Server started on http://localhost:${port}`);
});
