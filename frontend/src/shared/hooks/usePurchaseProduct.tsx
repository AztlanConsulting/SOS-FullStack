import type { PurchaseRequest } from '@shared/types/purchase.types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usePetReport } from '@/shared/context/PetReportContext';

export default function usePurchaseProduct(purchaseRequest: PurchaseRequest) {
  const navigate = useNavigate();
  const { setLostPetReportData } = usePetReport();
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
    setLostPetReportData(null);
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
