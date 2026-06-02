import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export const activatePlanQueue = new Queue('payment-confirmation', {
  connection: redisConnection,
});
