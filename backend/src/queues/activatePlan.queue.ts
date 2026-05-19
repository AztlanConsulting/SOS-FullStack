import { Queue } from 'bullmq';
import { redis } from './redis';

export const activatePlanQueue = new Queue('payment-confirmation', {
  connection: redis,
});
