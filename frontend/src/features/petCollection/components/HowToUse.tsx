import { Text } from '@/shared/components/ui/Text';
import lostDogs from '@/assets/images/lost-dogs.webp';
import SelectImage from '@/assets/images/SelectImage.webp';
import Gallery from '@/assets/images/Gallery.webp';
import Filter from '@/assets/images/Filter.webp';
import HeroSection from '@/shared/components/layout/HeroSection';

const HowToUse = () => {
  return (
    <div className="mb-4">
      <HeroSection
        title={'Radar de coincidencias'}
        image={lostDogs}
        bg="bg-purple-secondary"
        shadowClass="shadow-dark-purple md:max-h-84 object-top"
        content=""
      >
        <Text>Encuentra posibles coincidencias de tu mascota.</Text>
        <Text>
          Sube una fotografía de tu mascota perdida y nuestro sistema analizará
          la imagen para detectar mascotas encontradas con características
          similares.
        </Text>
        <br />
        <Text>
          La herramienta puede ayudarte a localizar posibles avistamientos,
          publicaciones o reportes relacionados con tu mascota y facilitar el
          contacto con la persona que la encontró.
        </Text>
      </HeroSection>
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
              className="w-4/5 md:w-1/2 h-auto rounded-lg"
            />
            <div className="flex-1 max-w-xl lg:max-w-2xl text-center md:text-left lg:text-left order-1 lg:order-2">
              <Text
                as="h3"
                variant="h3"
                weight="medium"
                className="mb-4 lg:mb-6"
              >
                Sube una foto de tu mascota dando click en “Subir imagen”.
              </Text>
              <Text variant="body" className="text-left">
                Puedes probar con diferentes fotos para aumentar las
                posibilidades de coincidencia.
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
              className="w-4/5 md:w-1/3 h-auto rounded-lg"
            />
            <div className="flex-1 max-w-xl lg:max-w-2xl text-center md:text-left lg:text-left order-1 lg:order-2">
              <Text
                as="h3"
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
              className="w-4/5 md:w-1/3 h-auto rounded-lg"
            />
            <div className="flex-1 max-w-xl lg:max-w-2xl text-center md:text-left lg:text-left order-1 lg:order-2">
              <Text
                as="h3"
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
