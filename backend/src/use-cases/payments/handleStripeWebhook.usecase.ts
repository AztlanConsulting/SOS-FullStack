import type {
  PaymentProvider,
  EventDTO,
} from '@domain/ports/paymentProvider.port';
import type { Stripe } from 'stripe';

export const handleStripeWebhook = async (
  paymentProvider: PaymentProvider,
  data: EventDTO,
): Promise<Stripe.Event> => {
  return await paymentProvider.constructEvent({
    payload: data.payload,
    sig: data.sig,
    secret: data.secret,
  });
};
