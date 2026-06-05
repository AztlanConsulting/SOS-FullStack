import { useState } from 'react';
import type { AxiosError } from 'axios';
import type { ChangeEvent, FormEvent } from 'react';
import { forgotPasswordRequest } from '../services/auth.service';

const EMAIL_FIELD_NAME = 'email';

type ForgotPasswordFormData = {
  email: string;
};

type ForgotPasswordErrors = Partial<
  Record<keyof ForgotPasswordFormData, string>
>;

const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? fallback;
};

const getEmailFieldError = (
  email: string,
  emailInput: HTMLInputElement | null,
) => {
  if (!email.trim()) return 'Ingresa un correo electrónico';

  if (emailInput?.validity.typeMismatch) return 'Correo invalido';

  return undefined;
};

export const useForgotPasswordForm = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const updateFormData = (newData: Partial<ForgotPasswordFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    setSubmitError(null);

    setErrors((prev) => {
      const copy = { ...prev };

      Object.keys(newData).forEach((fieldName) => {
        delete copy[fieldName as keyof ForgotPasswordFormData];
      });

      return copy;
    });
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateFormData({ email: event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    const emailInput = event.currentTarget.elements.namedItem(
      EMAIL_FIELD_NAME,
    ) as HTMLInputElement | null;
    const cleanEmail = formData.email.trim();
    const emailError = getEmailFieldError(cleanEmail, emailInput);
    const newErrors: ForgotPasswordErrors = {};

    setSubmitError(null);
    setMessage(null);
    setShowSuccessModal(false);

    if (emailError) {
      newErrors.email = emailError;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const response = await forgotPasswordRequest(cleanEmail);
      setMessage(response.message);
      setShowSuccessModal(true);
    } catch (requestError) {
      setSubmitError(
        getErrorMessage(
          requestError,
          'No se pudo enviar el enlace de restablecimiento.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email: formData.email,
    errors,
    loading,
    submitError,
    message,
    showSuccessModal,
    handleEmailChange,
    handleSubmit,
  };
};
