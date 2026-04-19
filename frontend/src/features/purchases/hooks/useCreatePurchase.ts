import { useState } from 'react';
import { createPurchase } from '../services/createPurchase.service';
import type { CreatePurchaseParams } from '../types/CreatePurchaseParams.type';

export const useCreatePurchase = ({
  userEmail,
  paymentId,
  productId,
  productType,
}: CreatePurchaseParams) => {
  const [status, setStatus] = useState<string>('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const createPurchaseRequest = async () => {
    try {
      setStatus('loading');
      setError('');

      const responseMessage = await createPurchase(
        userEmail,
        paymentId,
        productId,
        productType,
      );

      setStatus('success');
      setMessage(responseMessage);
      return responseMessage;
    } catch (purchaseError) {
      const purchaseMessage =
        purchaseError instanceof Error
          ? purchaseError.message
          : 'Purchase creation failed';

      setStatus('error');
      setError(purchaseMessage);
      return null;
    }
  };

  return {
    status,
    message,
    error,
    createPurchaseRequest,
  };
};
