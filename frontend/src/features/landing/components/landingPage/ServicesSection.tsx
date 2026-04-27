import { Text } from '../../../../shared/components/ui/Text';
import Localizacion from '@assets/images/Localizacion.png';

const ServicesSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16 relative">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center lg:justify-between gap-8 lg:gap-12">
          <div className="relative ">
            <img
              src={Localizacion}
              alt="Servicios"
              className="w-full max-w-[350px] h-auto rounded-lg"
            />
          </div>
          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg:text-left order-1 lg:order-2">
            <Text
              as="h3"
              variant="h3"
              weight="medium"
              className="mb-4 lg:mb-6 text-center md:text-left lg:text-left"
            >
              La tecnología detrás.
            </Text>
            <Text variant="body" className="text-left">
              Utilizamos herramientas de segmentación geográfica para mostrar la
              publicación a usuarios en tu zona, aumentando significativamente
              las probabilidades de que alguien lo reconozca y pueda ayudarte a
              encontrarlo más rápido.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
