import express from 'express';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from '@interfaces/routes/routes';
import '@domain/models';
import cors from 'cors';
import path from 'path';

async function loadWorkers() {
  if (process.env.NODE_ENV !== 'test') {
    await import('@/queues/activatePlan.worker');
    await import('@/queues/sendEmail.worker');
  }
}

void loadWorkers();

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

// Webhook must receive raw body for Stripe signature verification
// This middleware must run before the standard JSON parser
app.use('/payments/webhook', bodyparser.raw({ type: 'application/json' }));
app.use('/payments/webhook', (req, res, next) => {
  // req.body is a Buffer from bodyparser.raw(), store it as rawBody
  if (Buffer.isBuffer(req.body)) {
    (req as any).rawBody = req.body;
  } else if (typeof req.body === 'string') {
    // In case body is a string (shouldn't happen with bodyparser.raw), convert it
    (req as any).rawBody = Buffer.from(req.body);
  }
  next();
});

app.use(bodyparser.json({ limit: '20mb' }));
app.set('trust proxy', true);
app.use(cookieParser());

// Routes
app.use('/', routes);

export default app;
