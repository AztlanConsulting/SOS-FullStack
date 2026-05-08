import type { PurchaseRequest } from '@shared/types/purchase.types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usePetReport } from '@/shared/context/PetReportContext';

export default function usePurchaseProduct(purchaseRequest: PurchaseRequest) {
  const navigate = useNavigate();
  const { setLostPetReportData } = usePetReport();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');

  const isValidName = (name: string) => {
    const normalizedName = name.trim().replace(/\s+/g, ' ');
    const nameParts = normalizedName.split(' ');

    return (
      nameParts.length >= 2 &&
      nameParts[0].length > 0 &&
      nameParts[1].length > 0
    );
  };

  const isValidEmail = (email: string) => {
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim().length > 0
    );
  };

  const handleEmailChange = (email: string) => {
    setUserEmail(email);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleNameChange = (name: string) => {
    setUserName(name);
    if (nameError) {
      setNameError('');
    }
  };

  const handleProceedToPayment = () => {
    const trimmedEmail = userEmail.trim();

    const nameValid = isValidName(userName);
    const emailValid = isValidEmail(trimmedEmail);

    if (!nameValid) {
      setNameError('Ingresa nombre y apellido para contactarte');
    } else {
      setNameError('');
    }

    if (!emailValid) {
      setEmailError('Ingresa un correo electrónico válido.');
    } else {
      setEmailError('');
    }

    if (!nameValid || !emailValid) return;

    // @ts-ignore
    setLostPetReportData(null);
    navigate('/compra', {
      state: {
        userName: userName.trim().replace(/\s+/g, ' '),
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
    userName,
    nameError,
    handleEmailChange,
    handleNameChange,
    handleProceedToPayment,
  };
}
