import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import type { Order, PurchaseDetail } from '../types/payment.types';
import { createPurchase } from '@/features/purchases/services/createPurchase.service';
import { createLostPetReportRequest } from '@/features/users/services/lostPet.service';
import type { PurchasedPlanResponse } from '@/shared/types/pet.types';

interface UseCheckoutProps {
  data: Order;
  paymentId?: string;
  purchaseDetail?: PurchaseDetail;
  paymentMethod?: string;
  onSuccess?: () => void;
  onPending?: () => void;
}

export const useCheckout = ({
  data,
  paymentId,
  purchaseDetail,
  paymentMethod,
  onSuccess,
  onPending,
}: UseCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);

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

    // For card payments, if succeeded immediately, complete the purchase
    if (paymentIntent?.status === 'succeeded' && paymentMethod === 'card') {
      if (purchaseDetail && paymentId) {
        let newPetId;
        if (data.plan) {
          const petResult: PurchasedPlanResponse =
            await createLostPetReportRequest(data.plan);

          console.log(petResult);
          console.log(data.plan);
          newPetId = petResult.plan.petId;
        }
        console.log(
          'Creating purchase with:',
          data.email || '',
          paymentId,
          newPetId,
          'plan',
        );
        console.log(data);
        try {
          await createPurchase(
            data.email || '',
            paymentId,
            newPetId || '',
            'plan',
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
    } else if (paymentIntent?.status === 'requires_action') {
      // For OXXO/SPEI, show confirmation step
      setShowConfirmation(true);
    }

    setIsProcessing(false);
  };

  const handleConfirmation = () => {
    onPending?.();
  };

  return {
    handleSubmit,
    handleConfirmation,
    isProcessing,
    message,
    isReady: !!stripe && !!elements,
    showConfirmation,
    setShowConfirmation,
  };
};
