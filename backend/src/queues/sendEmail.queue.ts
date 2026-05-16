import { Queue } from 'bullmq';
import { redis } from './redis';

export const sendEmailQueue = new Queue('send-email', {
  connection: redis,
});
