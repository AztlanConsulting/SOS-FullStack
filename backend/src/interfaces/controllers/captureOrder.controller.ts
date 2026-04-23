import type { Request, Response } from 'express';
import { default as ucCaptureOrder } from '@use-cases/payments/captureOrder';
import paypalApi from '@infrastructure/api/paypal.api';
import { PaymentDataAccess } from '@infrastructure/data-access/payment.data-access';
import { markAsSucceededDB } from '@/use-cases/payments/markAsSuccededDB.usecase';
import { createPurchaseDB } from '@/use-cases/purchases/createPurchaseDB.usecase';
import { PurchaseDataAccess } from '@infrastructure/data-access/purchase.data-access';
import { purchaseDetails } from '@/types/payment.types';

export default async function captureOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    const details = purchaseDetails.safeParse(req.body);
    if (details.error) throw details.error;

    const { userEmail, productId, productType } = details.data;

    const response = await ucCaptureOrder(paypalApi, orderId as string);

    if (Boolean(response.error)) throw response.error;

    const result = await markAsSucceededDB(PaymentDataAccess, String(orderId));

    if (result === 'not_found' || result === 'already_updated') {
      console.warn('Payment not found in DB or already updated');
    }

    let id: string | undefined = productId;
    if (!Boolean(productId)) {
      id = '123'; // Register plan details and return id
    }

    await createPurchaseDB(PurchaseDataAccess, {
      userEmail,
      paymentId: response.id!,
      productId: productId ?? id!,
      productType,
    });

    if (response.id !== undefined) return res.status(200).send(response.id);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
