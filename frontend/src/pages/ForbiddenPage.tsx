import { useNavigate } from 'react-router';
import { Text } from '@shared/components/ui/Text';
import yellowIcon from '@assets/images/yellowIcon.png';

/**
 * ForbiddenPage
 *
 * Displays an access denied screen when the user tries to access
 * a route without sufficient permissions.
 *
 * Provides navigation options to:
 * - Return to home
 * - Go back to the previous page
 */
export const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen color-secondary-bg flex items-center justify-center px-6 py-12">
      <div className="w-full flex items-center justify-center">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[var(--color-primary)] p-8 md:p-10 shadow-sm text-center mx-auto w-full max-w-md">
            {/* LOGO */}
            <img src={yellowIcon} alt="logo" className="w-24 mx-auto mb-6" />

            {/* TITLE */}
            <Text
              as="h1"
              variant="h2"
              weight="semibold"
              className="text-black mb-3"
            >
              Acceso denegado
            </Text>

            {/* DESCRIPTION */}
            <Text variant="body" className="color-grey-text mb-6">
              No tienes permisos para acceder a esta página.
            </Text>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 rounded-full color-primary-bg text-white font-semibold hover:opacity-90 transition"
              >
                Ir al inicio
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full py-3 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-secondary)] transition"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
