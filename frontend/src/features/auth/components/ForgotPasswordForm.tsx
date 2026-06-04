import { useNavigate } from 'react-router';
import yellowIcon from '@assets/images/yellowIcon.webp';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { Text } from '@shared/components/ui/Text';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const {
    email,
    errors,
    loading,
    submitError,
    message,
    showSuccessModal,
    handleEmailChange,
    handleSubmit,
  } = useForgotPasswordForm();

  return (
    <div className="w-full min-h-screen color-secondary-bg flex items-center justify-center px-6 py-8 color-grey-border-top">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="relative bg-white rounded-2xl border-2 border-[var(--color-primary)] px-6 py-10 md:p-10 shadow-sm text-center mx-auto w-full max-w-lg">
          <div className="mx-auto w-full max-w-lg">
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
              Introduce tu correo electrónico asociado a tu cuenta. Te
              enviaremos instrucciones para restablecer tu contraseña.
            </Text>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5 text-left"
            >
              <Input
                id="forgot-password-email"
                name="email"
                label="Correo electrónico"
                type="email"
                value={email}
                maxLength={128}
                onChange={handleEmailChange}
                autoComplete="email"
                error={errors.email}
              />

              <Button
                type="submit"
                label={
                  loading ? 'Enviando...' : 'Enviar enlace de restablecimiento'
                }
                disabled={loading}
                variant="primary"
                bgColor="!rounded-full !py-3"
              />

              {submitError && !errors.email && (
                <Text variant="caption" as="p" className="color-danger">
                  {submitError}
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

          {showSuccessModal && (
            <div className="absolute left-4 right-4 top-1/2 z-10 -translate-y-1/2 overflow-hidden rounded-lg border-2 border-[var(--color-grey-border)] bg-white shadow-xl">
              <div className="color-primary-bg border-b-2 border-[var(--color-grey-border)] px-4 py-3">
                <Text
                  variant="caption"
                  as="p"
                  className="color-grey-text text-center"
                >
                  ¡Advertencia!
                </Text>
              </div>

              <div className="px-5 py-6 text-left">
                <Text variant="caption" as="p" className="color-grey-text mb-6">
                  {message ??
                    '¡Se ha enviado un link a tu correo! Revisa en las últimas entradas o en el spam.'}
                </Text>

                <div className="flex justify-center">
                  <Button
                    onClick={() => navigate('/login')}
                    label="Regresar al inicio"
                    variant="primary"
                    bgColor="!w-auto !max-w-none !rounded-full !px-6 !py-3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
