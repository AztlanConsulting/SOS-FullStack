import { Text } from '../../../shared/components/ui/Text';
import { Button } from '../../../shared/components/ui/Button';
import { HiChevronRight } from 'react-icons/hi';

const HeroSection = () => {
  return (
    <section className="relative color-secondary-bg overflow-hidden py-8 lg:py-16">
      <div className="w-5/6 mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex-1 max-w-xl lg:max-w-2xl order-2 lg:order-1 text-left">
            <Text as="h1" variant="h1" weight="medium" className="mb-4 lg:mb-6">
              Te ayudamos a buscar tu mascota
            </Text>
            <Text variant="body" weight="regular" className="mb-8 lg:mb-10">
              Publica anuncios, difunde la búsqueda y utiliza nuestros servicios
              para reunir a tu mascota con su familia.
            </Text>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-center justify-center">
              <Button
                label="Perdí mi mascota"
                variant="primary"
                icon={HiChevronRight}
              />

              <Button
                label="Encontré una mascota"
                variant="secondary"
                icon={HiChevronRight}
              />
            </div>
          </div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <img
              src="/a9b7513d-555d-45ad-ab13-c11750d8d120 1.png"
              alt="Mascota"
              className="w-[215px] h-[283px] lg:w-[300px] lg:h-[380px] xl:w-[350px] xl:h-[440px] rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
