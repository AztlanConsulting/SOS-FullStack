import { Text } from '../../../../shared/components/ui/Text';

const ServicesSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16 relative">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8 lg:mb-12">
          <Text as="h2" variant="h2" weight="medium">
            ¿Cómo te podemos ayudar?
          </Text>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-30">
          <div className="relative ">
            <img
              src="/yellowLine.png"
              alt="Background"
              className="absolute left-0 -z-10 w-[120%] scale-150"
              style={{
                top: 'calc((1 / 2 * 100%) - 25px)',
              }}
            />
            <img
              src="/dog1.png"
              alt="Servicios"
              className="relative z-10 mx-auto w-[200px] h-[200px] object-cover"
            />
          </div>
          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg: text-left order-1 lg:order-2">
            <Text
              as="h3"
              variant="h3"
              weight="medium"
              className="mb-4 lg:mb-6 text-center lg:text-left"
            >
              Ingresa la información de <br className="hidden lg:block" />
              tu mascota
            </Text>
            <Text variant="body" className="text-left">
              Compártenos el nombre de tu mascota, dónde se perdió, y algunas
              fotos para los anuncios en Facebook
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
