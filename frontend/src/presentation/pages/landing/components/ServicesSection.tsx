import { Text } from '../../../../shared/components/ui/Text';

const ServicesSection = () => {
  return (
    <section className="bg-white overflow-hidden p-8 lg:p-16">
      <div className="w-full">
        <div className="text-center mb-8 lg:mb-12">
          <Text as="h2" variant="h2" weight="medium">
            ¿Cómo te podemos ayudar?
          </Text>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-12">
          <div className="">
            <img
              src="/image 7.png"
              alt="Servicios"
              className=""
            />
          </div>

          <div className="text-center lg:text-right">
            <Text as="h3" variant="h3" weight="medium" className="mb-4 lg:mb-6">
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
