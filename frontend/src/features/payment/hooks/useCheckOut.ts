import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import type { PurchaseDetail } from '../types/payment.types';
import { createPurchase } from '@/features/purchases/services/createPurchase.service';

interface UseCheckoutProps {
  paymentId?: string;
  purchaseDetail?: PurchaseDetail;
  paymentMethod?: string;
  onSuccess?: () => void;
  onPending?: () => void;
}

export const useCheckout = ({
  paymentId,
  purchaseDetail,
  paymentMethod,
  onSuccess,
  onPending,
}: UseCheckoutProps = {}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);

    // For card payments, try to complete without redirect
    if (paymentMethod === 'card') {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message ?? 'Ocurrió un error inesperado.');
        } else {
          setMessage('Ocurrió un error inesperado.');
        }
        setIsProcessing(false);
        return;
      }

      // If payment succeeded, create purchase immediately
      if (
        paymentIntent?.status === 'succeeded' &&
        purchaseDetail &&
        paymentId
      ) {
        try {
          await createPurchase(
            purchaseDetail.userEmail,
            paymentId,
            purchaseDetail.productId,
            purchaseDetail.productType,
          );
          setMessage('Pago procesado exitosamente');
        } catch (error) {
          console.error('Error creating purchase:', error);
          setMessage('Error al procesar la compra');
          setIsProcessing(false);
          return;
        }

        onSuccess?.();
      }
    } else {
      // For OXXO/SPEI, just show pending modal without redirect
      onPending?.();
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
