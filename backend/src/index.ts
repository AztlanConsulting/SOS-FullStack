import express from 'express';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from '@interfaces/routes/routes';
import '@domain/models';
import cors from 'cors';
import path from 'path';

if (process.env.NODE_ENV !== 'test') {
  require('@/queues/activatePlan.worker');
  require('@/queues/sendEmail.worker');
}
const app = express();

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.set('trust proxy', 1);

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
app.use(cookieParser());

// Routes
app.use('/', routes);

export default app;
