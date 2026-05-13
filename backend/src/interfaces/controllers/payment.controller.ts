import type { Request, Response } from 'express';
import { createPaymentIntent } from '@use-cases/payments/createPaymentIntent.usecase';
import { handleStripeWebhook } from '@use-cases/payments/handleStripeWebhook.usecase';
import { createPendingIntentDB } from '@use-cases/payments/createPendingIntentDB.usecase';
import { markAsSucceededDB } from '@use-cases/payments/markAsSuccededDB.usecase';
import { StripeProvider } from '@infrastructure/api/stripeProvider.api';
import { PaymentDataAccess } from '@infrastructure/data-access/payment.data-access';
import type Stripe from 'stripe';
import { sendPaymentEmail } from '@/use-cases/emails/sendPaymentEmail.usecase';
import { pendingPaymentEmailService } from '@/infrastructure/service/pendingPaymentEmail.service';
import { findPaymentByOrderIdDB } from '@/use-cases/payments/findPaymentByOrderIdDB.usecase';
import { getPurchasesByPaymentIdDB } from '@/use-cases/purchases/getPurchasesByPaymentIdDB.usecase';
import { PurchaseDataAccess } from '@/infrastructure/data-access/purchase.data-access';
import activateLostPetReport from '@/use-cases/clients/activateLostPetReport.usecase';
import { purchasedPlanDataAccess } from '@infrastructure/data-access/purchasedPlan.data-access';
import { sendManualEmail } from '@/use-cases/emails/sendManualEmail.usecase';
import { sendManualEmailService } from '@/infrastructure/service/sendManualEmail.service';
import { getManualByIdDB } from '@/use-cases/manuals/getManualsDB.usecase';
import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';

/**
 * middleware to create a Stripe payment intent.
 * @returns Express middleware handler that creates a payment intent with amount and currency from request body
 */
export const makeCreatePaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency, method, name, email } = req.body as {
      amount: number;
      currency: string;
      method?: string;
      name?: string;
      email?: string;
    };

    const idempotencyKey = req.headers['x-idempotency-key'];
    if (amount === undefined || currency === undefined) {
      return res.status(400).json({ error: 'Missing amount or currency' });
    }

    const result = await createPaymentIntent(StripeProvider, {
      amount,
      currency,
      method,
      name,
      email,
      idempotencyKey: String(idempotencyKey),
    });

    try {
      const paymentExists = await findPaymentByOrderIdDB(
        PaymentDataAccess,
        result.id,
      );
      if (paymentExists) {
        return res.status(200).json({
          message: 'Payment intent already exists',
          result: result,
        });
      }
      await createPendingIntentDB(PaymentDataAccess, {
        orderId: result.id,
        amount: result.amount / 100,
        method: method ?? 'unknown',
        currency: result.currency,
        clientSecret: result.clientSecret ?? null,
      });
      /** * Send email for OXXO */
      if (method === 'oxxo' && email && result.oxxoDetails) {
        await sendPaymentEmail(pendingPaymentEmailService, {
          to: email,
          name: name ?? 'Usuario',
          method: 'oxxo',
          amount: result.amount / 100,
          oxxoNumber: result.oxxoDetails?.number ?? undefined,
          voucherUrl: result.oxxoDetails?.voucherUrl ?? undefined,
          expiresAfter: result.oxxoDetails?.expiresAfter ?? undefined,
        });
      }
      /** * Send email for SPEI */
      if (method === 'spei' && email && result.speiDetails) {
        await sendPaymentEmail(pendingPaymentEmailService, {
          to: email,
          name: name ?? 'Usuario',
          method: 'spei',
          amount: result.amount / 100,
          clabe: result.speiDetails?.clabe ?? undefined,
          reference: result.speiDetails?.reference ?? undefined,
          bankName: result.speiDetails?.bankName ?? undefined,
          bankCode: result.speiDetails?.bankCode ?? undefined,
          holderName: result.speiDetails?.holderName ?? undefined,
          holderAddress: result.speiDetails?.holderAddress ?? undefined,
        });
      }

      return res.status(201).json({
        message: 'Payment intent created successfully',
        result: result,
      });
    } catch (error: any) {
      throw error;
    }
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Payment failed';
    return res.status(500).json({ error: message });
  }
};

/**
 * Stripe webhook handler that processes payment intent events and updates payment status.
 * @param req - Express request with Stripe signature header and raw body
 * @param res - Express response to send webhook confirmation
 */
export const makehandleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (
    typeof sig !== 'string' ||
    typeof webhookSecret !== 'string' ||
    webhookSecret.trim() === ''
  ) {
    console.error('Webhook Error: Missing signature or secret');
    res.status(400).send('Webhook Error: Missing signature or secret');
    return;
  }

  try {
    // Access the raw body attached by the middleware in index.ts
    const { rawBody } = req as Request & { rawBody: Buffer };

    if (!(rawBody instanceof Buffer)) {
      throw new Error('Raw body not found. Check body-parser configuration.');
    }

    // Use the raw body for signature verification
    const event = await handleStripeWebhook(StripeProvider, {
      payload: rawBody,
      sig: sig as string,
      secret: webhookSecret,
    });

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Update the payment status in MongoDB
      const result = await markAsSucceededDB(
        PaymentDataAccess,
        paymentIntent.id,
      );
      if (result === 'not_found') {
        console.warn('Payment not found in DB');
      }

      if (result === 'already_updated') {
        console.log('Webhook already processed (idempotent)');
      }

      // Retry mechanism to wait for purchase creation (up to 5 seconds)
      // Due to the asynchronous nature of webhooks and database operations,
      // we may receive the webhook before the purchase record is created.
      let purchase = null;
      for (let i = 0; i < 10; i++) {
        const purchases = await getPurchasesByPaymentIdDB(
          PurchaseDataAccess,
          paymentIntent.id,
        );
        if (purchases && purchases.length > 0) {
          purchase = purchases[0];
          break;
        }
        // Wait 500ms before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (!purchase) {
        // console.warn(
        //   `No purchase found for payment ${paymentIntent.id} after retries`,
        // );
        res.json({ received: true });
        return;
      }

      if (purchase.productType === 'plan') {
        const planActivation = await activateLostPetReport(
          purchasedPlanDataAccess,
          purchase.productId,
        );
        if (!planActivation) console.error("Plan couldn't be activated");
      }

      if (purchase.productType === 'manual') {
        const manualData = await getManualByIdDB(
          ManualDataAccess,
          purchase.productId,
        );
        if (manualData) {
          const { name, imageUrl, pdfUrl } = manualData;
          await sendManualEmail(sendManualEmailService, {
            to: purchase.userEmail,
            manualName: name,
            imageUrl,
            pdfUrl,
          });
        }
      }
    }

    res.json({ received: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown webhook error';
    res.status(400).send(`Webhook Error: ${message}`);
  }
};
