import type { Request, Response } from 'express';
import { default as ucCaptureOrder } from '@use-cases/payments/captureOrder';
import paypalApi from '@infrastructure/api/paypal.api';

export default async function captureOrder(req: Request, res: Response) {
  const { orderId } = req.params;

  const response = await ucCaptureOrder(paypalApi, orderId as string);

  if (response.id) return res.status(200).send(response.id);

  res.status(500).send(response.error);
}
