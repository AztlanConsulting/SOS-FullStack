import { useEffect, useState } from 'react';
import { createPaymentIntent } from '@/features/payment/services/stripe.service';
import type {
  Order,
  OxxoDetails,
  PaymentIntent,
  SpeiDetails,
} from '@/features/payment/types/payment.types';

export const useStripeHook = (data: Order, idempotencyKey: string) => {
  const [clientSecret, setClientSecret] = useState<string | undefined>();
  const [paymentId, setPaymentId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [oxxoData, setOxxoData] = useState<OxxoDetails | null>(null);
  const [speiData, setSpeiData] = useState<SpeiDetails | null>(null);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        setLoading(true);
        const paymentIntentBody: PaymentIntent = {
          amount: data.amount,
          currency: data.currency,
          method: data.method,
          name: data.name,
          email: data.email,
          idempotencyKey,
          ...(data.product && { product: data.product }),
          ...(data.plan !== undefined && { plan: data.plan }),
        };
        const res = await createPaymentIntent(paymentIntentBody);

        if (cancelled) return;

        setClientSecret(res.clientSecret ?? undefined);
        setPaymentId(res.id ?? undefined);
        setOxxoData(res.oxxoDetails ?? null);
        setSpeiData(res.speiDetails ?? null);
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    clientSecret,
    loading,
    paymentId,
    oxxoData,
    speiData,
  };
};
