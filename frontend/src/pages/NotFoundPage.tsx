import { useNavigate } from 'react-router';
import yellowIcon from '@assets/images/yellowIcon.webp';
import { Button } from '@shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen color-secondary-bg flex items-center justify-center px-6 py-8 color-grey-border-top">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border-2 border-[var(--color-primary)] px-6 py-10 md:p-10 shadow-sm text-center mx-auto w-full max-w-lg">
          <img
            loading="lazy"
            src={yellowIcon}
            alt="Logo de SOS"
            className="w-28 mx-auto mb-4 cursor-pointer"
            onClick={() => navigate('/')}
          />

          <Text
            as="h1"
            variant="h2"
            weight="medium"
            className="mb-6 text-black"
          >
            Lo sentimos, esta página no existe <br /> :(
          </Text>

          <Button
            onClick={() => navigate('/')}
            label="Ir al inicio"
            variant="primary"
            bgColor="!rounded-full !py-3"
          />
        </div>
      </div>
    </div>
  );
};
