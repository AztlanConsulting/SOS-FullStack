import { useNavigate } from 'react-router';
import { Text } from '../../../../shared/components/ui/Text';
import { Button } from '../../../../shared/components/ui/Button';
import { HiChevronRight } from 'react-icons/hi';
import owner from '@assets/images/owner.png';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleScrollToReport = () => {
    const section = document.getElementById('lostpet-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="relative color-secondary-bg overflow-hidden py-8 lg:py-10">
      <div className="lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-15 xl:gap-25">
          <div className="flex-1 lg:max-w-2xl order-2 lg:order-1 lg:mt-8 text-left flex flex-col items-center justify-center">
            <Text
              as="h1"
              variant="h1"
              weight="medium"
              className="mb-4 lg:mb-6 w-5/6 md:w-4/5 lg:w-full mx-auto"
            >
              Te ayudamos a buscar a tu mascota.
            </Text>
            <Text
              variant="body"
              weight="regular"
              className="mb-8 lg:mb-1 w-5/6 md:w-4/5 lg:w-full mx-auto"
            >
              El tiempo es clave y cada minuto puede marcar la diferencia. No
              tienes que pasar por esto solo. Vamos a difundir su búsqueda de
              forma estratégica para aumentar las posibilidades de encontrarla
              lo antes posible.
            </Text>

            <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col py-4 gap-4 sm:flex-row items-center justify-center">
              <Button
                label="Perdí mi mascota"
                variant="primary"
                icon={HiChevronRight}
                onClick={handleScrollToReport}
              />

              <Button
                label="Encontré una mascota"
                variant="secondary"
                icon={HiChevronRight}
                onClick={() => navigate('/mascotas-encontradas')}
              />
            </div>
          </div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <img
              src={owner}
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
