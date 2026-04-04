import express from 'express';
import bodyparser from 'body-parser';
import routes from './interfaces/routes/routes';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Start app
const app = express();

// App configuration
app.use(bodyparser.json());
app.set('trust proxy', true);

// Routes
app.use('/', routes);

// Port
const port = process.env.SERVER_PORT ?? 3000;

// START
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
