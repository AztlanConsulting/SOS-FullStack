import express from 'express';
import bodyparser from 'body-parser';
import routes from './interfaces/routes/routes';
import dotenv from 'dotenv';
import { mongoDB } from './infrastructure/database/mongoDB/mongoDB';
import cors from 'cors';

dotenv.config();

// MongoDB connection
await mongoDB();

// Start app
const app = express();

// App configuration
app.use(bodyparser.json());
app.set('trust proxy', true);
app.use(
  cors({
    origin: [process.env.FRONT_END_URL ?? 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

// Routes
app.use('/api', routes);

// Port
const port = process.env.SERVER_PORT ?? 3000;

// START
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
