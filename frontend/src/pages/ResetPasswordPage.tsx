import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate, useSearchParams } from 'react-router';
import { HiHome } from 'react-icons/hi2';
import yellowIcon from '@assets/images/yellowIcon.webp';
import {
  resetPasswordRequest,
  validateResetToken,
} from '@features/auth/services/auth.service';
import { Text } from '@shared/components/ui/Text';

const minPasswordLength = 8;

const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? fallback;
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      if (token.trim() === '') {
        setError('Link inválido o expirado');
        setValidatingToken(false);
        return;
      }

      try {
        await validateResetToken(token);
        setTokenValid(true);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Link inválido o expirado'));
      } finally {
        setValidatingToken(false);
      }
    };

    void validateToken();
  }, [token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setError(null);
    setMessage(null);

    if (newPassword.length < minPasswordLength) {
      setError(
        `La contraseña debe tener al menos ${minPasswordLength} caracteres`,
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      const response = await resetPasswordRequest(
        token,
        newPassword,
        confirmPassword,
      );
      setMessage(response.message);
      window.setTimeout(() => navigate('/login', { replace: true }), 700);
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, 'No se pudo actualizar la contraseña.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button className="top-0 h-8 my-2 w-full flex items-start justify-start">
        <HiHome
          size="100%"
          className="aspect-square text-primary w-fit ml-4 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </button>

      <div className="w-full min-h-screen color-secondary-bg flex items-center justify-center px-6 py-8 color-grey-border-top">
        <div className="w-full px-4 md:px-6 lg:max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[var(--color-primary)] px-6 py-10 md:p-10 shadow-sm text-center mx-auto w-full max-w-lg">
            <img
              loading="lazy"
              src={yellowIcon}
              alt="logo"
              className="w-28 mx-auto mb-4 cursor-pointer"
              onClick={() => navigate('/')}
            />

            <Text
              as="h1"
              variant="h2"
              weight="medium"
              className="mb-4 text-black"
            >
              Recuperar contraseña
            </Text>

            {validatingToken && (
              <Text variant="caption" as="p" className="color-grey-text">
                Validando enlace de recuperación...
              </Text>
            )}

            {!validatingToken && !tokenValid && (
              <div className="flex flex-col gap-5">
                <Text variant="caption" as="p" className="color-danger">
                  {error ?? 'Link inválido o expirado'}
                </Text>

                <button
                  type="button"
                  onClick={() => navigate('/olvide-contrasena')}
                  className="w-full py-3 rounded-full color-primary-bg text-white font-semibold hover:opacity-90 transition"
                >
                  Solicitar nuevo enlace
                </button>
              </div>
            )}

            {!validatingToken && tokenValid && (
              <>
                <Text
                  variant="caption"
                  as="p"
                  className="color-grey-text text-left mb-6"
                >
                  Ingresa tu nueva contraseña.
                </Text>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  <div className="relative w-full max-w-lg bg-white rounded-lg">
                    <input
                      type="password"
                      id="new-password"
                      placeholder=" "
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="peer w-full rounded-lg border border-[var(--color-grey-border)] px-4 pt-5 pb-2 text-sm focus:border-[var(--color-primary)] focus:outline-none text-black"
                    />
                    <label
                      htmlFor="new-password"
                      className="absolute left-4 top-0.5 text-sm color-grey-text pointer-events-none transition-colors peer-focus:text-[var(--color-primary)]"
                    >
                      Nueva contraseña
                    </label>
                  </div>

                  <div className="relative w-full max-w-lg bg-white rounded-lg">
                    <input
                      type="password"
                      id="confirm-password"
                      placeholder=" "
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className="peer w-full rounded-lg border border-[var(--color-grey-border)] px-4 pt-5 pb-2 text-sm focus:border-[var(--color-primary)] focus:outline-none text-black"
                    />
                    <label
                      htmlFor="confirm-password"
                      className="absolute left-4 top-0.5 text-sm color-grey-text pointer-events-none transition-colors peer-focus:text-[var(--color-primary)]"
                    >
                      Repite tu nueva contraseña
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full color-primary-bg text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {loading ? 'Confirmando...' : 'Confirmar nueva contraseña'}
                  </button>

                  {error && (
                    <Text variant="caption" as="p" className="color-danger">
                      {error}
                    </Text>
                  )}

                  {message && (
                    <Text variant="caption" as="p" className="color-success">
                      {message}
                    </Text>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
