import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';

export const useCheckout = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message ?? 'An unexpected error occurred.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    }

    setIsProcessing(false);
  };

  return {
    handleSubmit,
    isProcessing,
    message,
    isReady: !!stripe && !!elements,
  };
};
