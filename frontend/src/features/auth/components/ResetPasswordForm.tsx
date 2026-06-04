import { useNavigate, useSearchParams } from 'react-router';
import yellowIcon from '@assets/images/yellowIcon.webp';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { Text } from '@shared/components/ui/Text';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const {
    newPassword,
    confirmPassword,
    errors,
    validatingToken,
    tokenValid,
    loading,
    submitError,
    message,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  } = useResetPasswordForm({
    token,
    onPasswordReset: () => navigate('/login', { replace: true }),
  });

  return (
    <div className="w-full min-h-screen color-secondary-bg flex items-center justify-center px-6 py-8 color-grey-border-top">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border-2 border-[var(--color-primary)] px-6 py-10 md:p-10 shadow-sm text-center mx-auto w-full max-w-lg">
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

            {validatingToken && (
              <Text variant="caption" as="p" className="color-grey-text">
                Validando enlace de recuperación...
              </Text>
            )}

            {!validatingToken && !tokenValid && (
              <div className="flex flex-col gap-5">
                <Text variant="caption" as="p" className="color-danger">
                  {submitError ?? 'Link inválido o expirado'}
                </Text>

                <Button
                  onClick={() => navigate('/olvide-contrasena')}
                  label="Solicitar nuevo enlace"
                  variant="primary"
                  bgColor="!rounded-full !py-3"
                />
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
                  className="flex flex-col gap-5 text-left"
                >
                  <Input
                    type="password"
                    id="new-password"
                    label="Nueva contraseña"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    autoComplete="new-password"
                    hasLength={false}
                    error={errors.newPassword}
                  />

                  <Input
                    type="password"
                    id="confirm-password"
                    label="Repite tu nueva contraseña"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    autoComplete="new-password"
                    hasLength={false}
                    error={errors.confirmPassword}
                  />

                  <Button
                    type="submit"
                    label={
                      loading ? 'Confirmando...' : 'Confirmar nueva contraseña'
                    }
                    disabled={loading}
                    variant="primary"
                    bgColor="!rounded-full !py-3"
                  />

                  {submitError && (
                    <Text variant="caption" as="p" className="color-danger">
                      {submitError}
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
