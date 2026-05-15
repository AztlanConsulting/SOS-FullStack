import express from 'express';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from '@interfaces/routes/routes';
import '@domain/models';
import cors from 'cors';
import path from 'path';

const app = express();

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(
  cors({
    origin: process.env.FRONT_END_URL ?? 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.set('trust proxy', 1);

app.post(
  '/payments/webhook',
  bodyparser.raw({ type: 'application/json' }),
  (req, res, next) => {
    (req as any).rawBody = req.body;
    next();
  },
);

app.use(bodyparser.json({ limit: '20mb' }));
app.set('trust proxy', true);
app.use(cookieParser());

// Routes
app.use('/', routes);

export default app;
