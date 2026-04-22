import express from 'express';
import bodyparser from 'body-parser';
import routes from '@interfaces/routes/routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.set('trust proxy', true);

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

app.use(bodyparser.json({ limit: '20mb' }));
app.set('trust proxy', true);

// Routes
app.use('/', routes);

export default app;
