import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import yellowIcon from '@assets/images/yellowIcon.png';
import { Text } from '@shared/components/ui/Text';

export const LoginForm = () => {
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

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

    const success = await login(email, password);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen color-secondary-bg flex items-center justify-center px-6 py-6">
      {/* CONTENEDOR ESTÁNDAR */}
      <div className="w-full flex items-center justify-center">
        <div className="w-full px-4 md:px-6 lg:max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
          {/* CARD */}
          <div className="bg-white rounded-2xl border-2 border-[var(--color-primary)] p-6 md:p-10 shadow-sm text-center mx-auto w-full max-w-md">
            <img src={yellowIcon} alt="logo" className="w-28 mx-auto mb-4" />

            <Text
              as="h2"
              variant="h2"
              weight="medium"
              className="mb-4 text-black"
            >
              Iniciar Sesión
            </Text>

            <form onSubmit={handle} noValidate className="flex flex-col gap-5">
              {/* EMAIL */}
              <div className="relative w-full bg-white rounded-lg mt-4 mb-1">
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
              <div className="relative w-full bg-white rounded-lg mb-2">
                <input
                  type="password"
                  id="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full rounded-lg border border-[var(--color-grey-border)] px-4 pt-5 pb-2 text-sm focus:border-[var(--color-primary)] focus:outline-none text-black"
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-0.5 text-sm color-grey-text pointer-events-none transition-colors peer-focus:text-[var(--color-primary)]"
                >
                  Contraseña
                </label>
              </div>

              {/* REMEMBER */}
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
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

                  <Text variant="caption" className="color-grey-text">
                    Recuérdame
                  </Text>
                </label>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full color-primary-bg text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? 'Cargando...' : 'Iniciar sesión'}
              </button>

              {/* ERROR */}
              {error && (
                <Text variant="caption" className="color-danger mt-1">
                  {error}
                </Text>
              )}

              {/* FORGOT PASSWORD */}
              <Text variant="caption" className="color-grey-text mt-1">
                ¿Olvidaste tu contraseña?{' '}
                <span className="whitespace-nowrap underline cursor-pointer hover:text-black">
                  Recuperar Contraseña
                </span>
              </Text>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
