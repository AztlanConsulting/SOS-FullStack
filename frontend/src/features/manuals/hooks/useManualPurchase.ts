import { useState } from 'react';
import { useNavigate } from 'react-router';

type ManualPurchaseData = {
  _id: string;
  price: number;
};

export const useManualPurchase = (manual: ManualPurchaseData) => {
  const navigate = useNavigate();
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
    navigate('/purchase', {
      state: {
        userEmail: trimmedEmail,
        productId: manual._id,
        productType: 'manual',
        price: manual.price,
      },
    });
  };

  return {
    userEmail,
    emailError,
    handleEmailChange,
    handleProceedToPayment,
  };
};
