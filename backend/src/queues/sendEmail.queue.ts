import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export const sendEmailQueue = new Queue('send-email', {
  connection: redisConnection,
});
