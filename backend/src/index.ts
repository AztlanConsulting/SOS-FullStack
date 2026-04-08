import express from 'express';
import bodyparser from 'body-parser';
import routes from './interfaces/routes/routes';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { mongoDB } from './infrastructure/database/mongoDB/mongoDB';
import cors from 'cors';

// Configure .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MongoDB connection
await mongoDB();

// Start app
const app = express();

// App configuration
app.use(cors());
app.set('trust proxy', true);

// Middleware to capture raw body for Stripe webhook signature verification
app.use((req, res, next) => {
  if (req.path === '/payments/webhook') {
    let rawBody = Buffer.alloc(0);
    req.on('data', (chunk) => {
      rawBody = Buffer.concat([rawBody, chunk]);
    });
    req.on('end', () => {
      (req as any).rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
});

app.use(bodyparser.json());

// Routes
app.use('/', routes);

// Port
const port = process.env.SERVER_PORT ?? 3000;

// START
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
