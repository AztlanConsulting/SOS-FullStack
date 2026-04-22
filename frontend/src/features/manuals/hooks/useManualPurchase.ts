import { useState } from 'react';
import { useNavigate } from 'react-router';

type ManualPurchaseData = {
  _id: string;
  price: number;
};

/**
 * Custom hook to manage manual purchase flow state and navigation.
 * Handles email validation, error display, and routing to the purchase page
 * with pre-populated manual data and user email.
 * @param manual - Object containing manual ID and price information
 * @returns Object containing email state, error state, and handler functions for email input and payment proceeding
 */
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
    navigate('/compra', {
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
