import { Text } from '../../../../shared/components/ui/Text';
import { Button } from '../../../../shared/components/ui/Button';
import { HiChevronRight } from 'react-icons/hi';

const HeroSection = () => {
  return (
    <section className="relative color-secondary-bg overflow-hidden py-8 lg:py-16">
      <div className="lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-15 xl:gap-25">
          <div className="flex-1 lg:max-w-2xl order-2 lg:order-1 lg:mt-8 text-left flex flex-col items-center justify-center">
            <Text
              as="h1"
              variant="h1"
              weight="medium"
              className="mb-4 lg:mb-6 w-5/6 md:w-4/5 lg:w-full mx-auto"
            >
              Te ayudamos a buscar tu mascota
            </Text>
            <Text
              variant="body"
              weight="regular"
              className="mb-8 lg:mb-1 w-5/6 md:w-4/5 lg:w-full mx-auto"
            >
              Publica anuncios, difunde la búsqueda y utiliza nuestros servicios
              para reunir a tu mascota con su familia.
            </Text>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-center justify-center w-full sm:w-5/6 lg:w-full lg:mt-10">
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
              src="/owner.png"
              alt="Mascota"
              className="w-auto h-[283px] lg:h-[330px] rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
