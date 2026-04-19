import express from 'express';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from '@interfaces/routes/routes';
import '@domain/models';
import cors from 'cors';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin == null) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
