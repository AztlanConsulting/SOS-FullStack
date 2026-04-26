import { Text } from '../../../../shared/components/ui/Text';
import Localizacion from '@assets/images/Localizacion.png';

const ServicesSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16 relative">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-30">
          <div className="relative ">
            <img
              src={Localizacion}
              alt="Servicios"
              className="relative z-10 mx-auto w-[250px] h-[250px] object-cover"
            />
          </div>
          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg: text-left order-1 lg:order-2">
            <Text
              as="h3"
              variant="h3"
              weight="medium"
              className="mb-4 lg:mb-6 text-center lg:text-left"
            >
              La tecnologia detras
            </Text>
            <Text variant="body" className="text-left">
              Utilizando herramientas de segmentación geográfica, mostramos la
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
