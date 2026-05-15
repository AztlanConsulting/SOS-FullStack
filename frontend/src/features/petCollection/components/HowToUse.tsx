import { Text } from '@/shared/components/ui/Text';
import lostDogs from '@/assets/images/lost-dogs.jpg';
import SelectImage from '@/assets/images/SelectImage.png';
import Gallery from '@/assets/images/Gallery.png';
import Filter from '@/assets/images/Filter.png';
import HeroSection from '@/shared/components/layout/HeroSection';

const HowToUse = () => {
  return (
    <div className="mb-4">
      <HeroSection
        title={'Galería de mascotas'}
        image={lostDogs}
        content={
          '¡Alguien pudo haber visto a tu mascota! Este es el lugar donde podrías buscar si han habido avistamentos de tu mascota y poder contactar con la persona que lo encontró.'
        }
        bg="bg-purple-secondary"
        shadow="shadow-dark-purple md:max-h-84 object-top"
      />
      <section className="bg-white overflow-hidden py-8 ">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
          <div className="text-center mb-8 lg:mb-20">
            <Text as="h2" variant="h2" weight="medium">
              ¿Cómo funciona?
            </Text>
          </div>
          <div className="flex flex-col md:flex-row items-center lg:justify-between gap-8 lg:gap-12">
            <img
              src={SelectImage}
              alt="Publicación"
              className="md:w-1/2 h-auto rounded-lg"
            />
            <div className="flex-1 max-w-xl lg:max-w-2xl text-center md:text-left lg:text-left order-1 lg:order-2">
              <Text
                as="h2"
                variant="h3"
                weight="medium"
                className="mb-4 lg:mb-6"
              >
                Sube una foto de tu mascota dando click en “Subir imagen”.
              </Text>
              <Text variant="body" className="text-left">
                Esta la puedes cambiar por si quieres probar con diferentes
                fotos.
              </Text>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white overflow-hidden py-8 ">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center lg:justify-between gap-8 lg:gap-12">
            <img
              src={Gallery}
              alt="Publicación"
              className="md:w-1/3 h-auto rounded-lg"
            />
            <div className="flex-1 max-w-xl lg:max-w-2xl text-center md:text-left lg:text-left order-1 lg:order-2">
              <Text
                as="h2"
                variant="h3"
                weight="medium"
                className="mb-4 lg:mb-6"
              >
                Busca entre las mascotas encontradas la tuya
              </Text>
              <Text variant="body" className="text-left">
                Puede que no aparezca en la primera imagen, pero tal vez sí más
                adelante
              </Text>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white overflow-hidden py-8 ">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center lg:justify-between gap-8 lg:gap-12">
            <img
              src={Filter}
              alt="Publicación"
              className="md:w-1/3 h-auto rounded-lg"
            />
            <div className="flex-1 max-w-xl lg:max-w-2xl text-center md:text-left lg:text-left order-1 lg:order-2">
              <Text
                as="h2"
                variant="h3"
                weight="medium"
                className="mb-4 lg:mb-6"
              >
                Usa la sección de filtros para una búsqueda más precisa
              </Text>
              <Text variant="body" className="text-left">
                Filtra por color, lugar o especie / tipo para buscar más
                facilmente
              </Text>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToUse;
