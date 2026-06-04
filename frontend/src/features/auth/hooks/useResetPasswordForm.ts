import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import type { ChangeEvent, FormEvent } from 'react';
import {
  resetPasswordRequest,
  validateResetToken,
} from '../services/auth.service';
import { getPasswordPolicyError } from '../utils/passwordPolicy';

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

type ResetPasswordErrors = Partial<Record<keyof ResetPasswordFormData, string>>;

type UseResetPasswordFormOptions = {
  token: string;
  onPasswordReset: () => void;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? fallback;
};

export const useResetPasswordForm = ({
  token,
  onPasswordReset,
}: UseResetPasswordFormOptions) => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const validateToken = async () => {
      if (token.trim() === '') {
        if (active) {
          setSubmitError('Link inválido o expirado');
          setValidatingToken(false);
        }
        return;
      }

      try {
        await validateResetToken(token);
        if (active) setTokenValid(true);
      } catch (requestError) {
        if (active) {
          setSubmitError(
            getErrorMessage(requestError, 'Link inválido o expirado'),
          );
        }
      } finally {
        if (active) setValidatingToken(false);
      }
    };

    void validateToken();

    return () => {
      active = false;
    };
  }, [token]);

  const updateFormData = (newData: Partial<ResetPasswordFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    setSubmitError(null);

    setErrors((prev) => {
      const copy = { ...prev };

      Object.keys(newData).forEach((fieldName) => {
        delete copy[fieldName as keyof ResetPasswordFormData];
      });

      if (Object.prototype.hasOwnProperty.call(newData, 'newPassword')) {
        delete copy.confirmPassword;
      }

      return copy;
    });
  };

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateFormData({ newPassword: event.target.value });
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    updateFormData({ confirmPassword: event.target.value });
  };

  const validateFields = () => {
    const newErrors: ResetPasswordErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Ingresa una contraseña';
    } else {
      const passwordPolicyError = getPasswordPolicyError(formData.newPassword);

      if (passwordPolicyError != null) {
        newErrors.newPassword = passwordPolicyError;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    const newErrors = validateFields();

    setErrors(newErrors);
    setSubmitError(null);
    setMessage(null);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const response = await resetPasswordRequest(
        token,
        formData.newPassword,
        formData.confirmPassword,
      );
      setMessage(response.message);
      window.setTimeout(onPasswordReset, 700);
    } catch (requestError) {
      setSubmitError(
        getErrorMessage(requestError, 'No se pudo actualizar la contraseña.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    newPassword: formData.newPassword,
    confirmPassword: formData.confirmPassword,
    errors,
    validatingToken,
    tokenValid,
    loading,
    submitError,
    message,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  };
};
