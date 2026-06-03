import { useState } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import yellowIcon from '@assets/images/yellowIcon.webp';
import { forgotPasswordRequest } from '@features/auth/services/auth.service';
import { Text } from '@shared/components/ui/Text';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? fallback;
};

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    const cleanEmail = email.trim();

    setError(null);
    setMessage(null);

    if (!emailRegex.test(cleanEmail)) {
      setError('El correo no es válido');
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPasswordRequest(cleanEmail);
      setMessage(response.message);
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'No se pudo enviar el enlace de restablecimiento.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen color-secondary-bg flex items-center justify-center px-6 py-8 color-grey-border-top">
      <div className="w-full px-4 md:px-6 lg:max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
        <div className="bg-white rounded-2xl border-2 border-[var(--color-primary)] p-6 md:p-10 shadow-sm text-center mx-auto w-full max-w-lg">
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

          <Text
            variant="caption"
            as="p"
            className="color-grey-text text-left mb-6"
          >
            Introduce tu correo electrónico asociado a tu cuenta. Te enviaremos
            instrucciones para restablecer tu contraseña.
          </Text>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <div className="relative w-full max-w-lg bg-white rounded-lg">
              <input
                type="email"
                id="forgot-password-email"
                placeholder=" "
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="peer w-full rounded-lg border border-[var(--color-grey-border)] px-4 pt-5 pb-2 text-sm focus:border-[var(--color-primary)] focus:outline-none text-black"
              />
              <label
                htmlFor="forgot-password-email"
                className="absolute left-4 top-0.5 text-sm color-grey-text pointer-events-none transition-colors peer-focus:text-[var(--color-primary)]"
              >
                Correo electrónico
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full color-primary-bg text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
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

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-8 text-sm color-grey-text underline hover:text-black transition"
          >
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
