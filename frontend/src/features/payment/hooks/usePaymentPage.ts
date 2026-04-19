import { useEffect, useRef, useState } from 'react';
import { createPaymentIntent } from '../services/payment.service';

export const usePaymentPage = () => {
  const [clientSecret, setClientSecret] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      if (window.location.pathname === '/completion') {
        setIsSuccess(true);
        setLoading(false);
        return;
      }

      const secret = await createPaymentIntent(2000, 'mxn');
      setClientSecret(secret ?? undefined);
      setLoading(false);
    };

    init();
  }, []);

  return {
    clientSecret,
    isSuccess,
    loading,
  };
};
