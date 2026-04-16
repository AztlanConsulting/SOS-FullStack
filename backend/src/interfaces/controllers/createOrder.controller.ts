import paypalApi from '@infrastructure/api/paypal.api';
import type { Request, Response } from 'express';
import { default as ucCreateOrder } from '@use-cases/payments/createOrder';

export default async function createOrder(req: Request, res: Response) {
  const orderId = await ucCreateOrder(paypalApi);
  if (orderId !== null) return res.status(200).json({ orderId });
  res.status(500).send('Error');
}
