import { useEffect, useState } from 'react';
import { createPaymentIntent } from '@/features/payment/services/stripe.service';
import type { Order } from '@/features/payment/types/payment.types';

export const useStripeHook = (data: Order) => {
  const [clientSecret, setClientSecret] = useState<string | undefined>();
  const [paymentId, setPaymentId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [oxxoData, setOxxoData] = useState<{
    number: string;
    expiresAfter: number;
    voucherUrl: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      try {
        const res = await createPaymentIntent(
          data.amount,
          data.currency,
          data.method,
          data.name,
          data.email,
        );

        if (!res) {
          console.error('createPaymentIntent returned no result');
          if (mounted) {
            setClientSecret(undefined);
            setPaymentId(undefined);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setClientSecret(res.clientSecret ?? undefined);
          setPaymentId(res.id ?? undefined);
          setOxxoData(res.oxxoDetails ?? null);
        }
      } catch (error) {
        console.error('Payment intent initialization failed:', error);
        if (mounted) {
          setClientSecret(undefined);
          setPaymentId(undefined);
          setLoading(false);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [data.amount, data.currency, data.method, data.name, data.email]);

  return {
    clientSecret,
    loading,
    paymentId,
    oxxoData,
  };
};
