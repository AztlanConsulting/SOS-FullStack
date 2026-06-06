import { useEffect, useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import yellowIcon from '@assets/images/yellowIcon.webp';
import { Text } from '@shared/components/ui/Text';
import type { User } from '../types/auth.types';
import roleNavigation from '@/shared/utils/roleNavigation';

type LoginLocationState = {
  passwordResetMessage?: string;
};

/**
 * LoginForm component
 *
 * Handles user authentication flow:
 * - Collects credentials
 * - Performs basic client-side validation
 * - Calls auth service via useAuth()
 * - Redirects user on successful login
 */
export const LoginForm = () => {
  const { login, loading, error, setError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const passwordResetMessage = (location.state as LoginLocationState | null)
    ?.passwordResetMessage;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const passwordToggleLabel = isPasswordVisible
    ? 'Ocultar clave'
    : 'Mostrar clave';

  useEffect(() => {
    setError(null);
  }, [setError]);

  /**
   * Handles form submission:
   * - Prevents default form behavior
   * - Validates input fields
   * - Calls login API
   * - Redirects user on success
   *
   * @param e - Form submit event
   */
  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('El correo no es válido');
      return;
    }

    if (!password) {
      setError('La contraseña es obligatoria');
      return;
    }

    const success = await login(email, password, remember);

    if (Boolean(success)) {
      navigate(roleNavigation((success as User).role));
    }
  };

  return (
    <div className="w-full min-h-screen color-secondary-bg flex items-center justify-center px-6 py-6 color-grey-border-top">
      <div className="w-full flex items-center justify-center">
        <div className="w-full px-4 md:px-6 lg:max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
          {/* CARD */}
          <div className="bg-white rounded-2xl border-2 border-[var(--color-primary)] p-6 md:p-10 shadow-sm text-center mx-auto w-full max-w-lg">
            {/* LOGO */}
            <img
              loading="lazy"
              src={yellowIcon}
              alt="logo"
              className="w-28 mx-auto mb-4 cursor-pointer"
              onClick={() => navigate('/')}
            />

            {/* TITLE */}
            <Text
              as="h2"
              variant="h2"
              weight="medium"
              className="mb-4 text-black"
            >
              Iniciar Sesión
            </Text>

            {passwordResetMessage && !error && (
              <Text variant="caption" as="p" className="color-success mb-2">
                {passwordResetMessage}
              </Text>
            )}

            <form onSubmit={handle} noValidate className="flex flex-col gap-5">
              {/* EMAIL */}
              <div className="relative w-full max-w-lg bg-white rounded-lg mt-4 mb-1">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full rounded-lg border border-[var(--color-grey-border)] px-4 pt-5 pb-2 text-sm focus:border-[var(--color-primary)] focus:outline-none text-black"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-0.5 text-sm color-grey-text pointer-events-none transition-colors peer-focus:text-[var(--color-primary)]"
                >
                  Correo electrónico
                </label>
              </div>

              {/* PASSWORD */}
              <div className="relative w-full max-w-lg bg-white rounded-lg mb-2">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full rounded-lg border border-[var(--color-grey-border)] px-4 pt-5 pb-2 pr-12 text-sm focus:border-[var(--color-primary)] focus:outline-none text-black"
                />
                <button
                  type="button"
                  aria-label={passwordToggleLabel}
                  aria-pressed={isPasswordVisible}
                  title={passwordToggleLabel}
                  onClick={() => setIsPasswordVisible((current) => !current)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-gray-500 transition-colors hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                >
                  {isPasswordVisible ? (
                    <Eye size={20} aria-hidden="true" />
                  ) : (
                    <EyeClosed size={20} aria-hidden="true" />
                  )}
                </button>
                <label
                  htmlFor="password"
                  className="absolute left-4 top-0.5 text-sm color-grey-text pointer-events-none transition-colors peer-focus:text-[var(--color-primary)]"
                >
                  Contraseña
                </label>
              </div>

              {/* REMEMBER ME*/}
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => {
                      const value = e.target.checked;
                      setRemember(value);
                    }}
                    className="hidden"
                  />

                  <div
                    className="
                    w-5 h-5 rounded border-2 border-[var(--color-primary)]
                    flex items-center justify-center
                    transition
                    "
                    style={{
                      backgroundColor: remember
                        ? 'var(--color-primary)'
                        : 'transparent',
                    }}
                  >
                    {remember && (
                      <svg
                        className="w-3.5 h-3.5 text-black"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <Text variant="caption" as="p" className="color-grey-text">
                    Recuérdame
                  </Text>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full color-primary-bg text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? 'Cargando...' : 'Iniciar sesión'}
              </button>

              {/* ERROR MESSAGE */}
              {error && (
                <Text variant="caption" as="p" className="color-danger mt-1">
                  {error}
                </Text>
              )}

              {/* FORGOT PASSWORD */}
              <Text variant="caption" as="p" className="color-grey-text mt-1">
                ¿Olvidaste tu contraseña?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/olvide-contrasena')}
                  className="whitespace-nowrap underline cursor-pointer hover:text-black transition"
                >
                  Recuperar Contraseña
                </button>
              </Text>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
