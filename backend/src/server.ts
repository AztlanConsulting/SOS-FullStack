import dotenv from 'dotenv';
import app from '@/index';
import logger from '@/utils/logger';
import { mongoDB } from '@infrastructure/database/mongoDB/mongoDB';

dotenv.config();

await mongoDB(process.env.ENV);

const port = process.env.SERVER_PORT ?? 3000;

process.on('uncaughtException', (err: any) => {
  logger.error('uncaughtException', {
    message: err?.message ?? String(err),
    stack: err?.stack,
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('unhandledRejection', { reason });
});

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
