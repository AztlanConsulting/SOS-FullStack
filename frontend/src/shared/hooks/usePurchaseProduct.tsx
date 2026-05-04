import { usePetReport } from '@/features/users/context/PetReportContext';
import type { PurchaseRequest } from '@shared/types/purchase.types';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function usePurchaseProduct(purchaseRequest: PurchaseRequest) {
  const navigate = useNavigate();
  const { setReportData } = usePetReport();
  const [userEmail, setUserEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleEmailChange = (email: string) => {
    setUserEmail(email);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleProceedToPayment = () => {
    const trimmedEmail = userEmail.trim();

    if (!isValidEmail(trimmedEmail)) {
      setEmailError('Ingresa un correo electrónico válido.');
      return;
    }

    setEmailError('');
    // @ts-ignore
    setReportData(null);
    navigate('/compra', {
      state: {
        userEmail: trimmedEmail,
        productId: purchaseRequest._id,
        productType: purchaseRequest.item,
        price: purchaseRequest.price,
      },
    });
  };

  return {
    userEmail,
    emailError,
    handleEmailChange,
    handleProceedToPayment,
  };
}
