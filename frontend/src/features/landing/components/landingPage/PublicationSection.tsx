import { Text } from '../../../../shared/components/ui/Text';
import acompanamiento from '@assets/images/acompanamiento.png';

const PublicationSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="text-center mb-8 lg:mb-20">
          <Text as="h2" variant="h2" weight="medium">
            ¿Cómo te podemos ayudar?
          </Text>
        </div>
        <div className="flex flex-col md:flex-row items-center lg:justify-between gap-8 lg:gap-12">
          <img
            src={acompanamiento}
            alt="Publicación"
            className="w-full max-w-[250px] h-auto"
          />

          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg:text-left order-1 lg:order-2">
            <Text as="h2" variant="h3" weight="medium" className="mb-4 lg:mb-6">
              No estás solo en esto.
            </Text>
            <Text variant="body" className="text-left">
              Sabemos lo duro que es este momento. Estamos contigo desde el
              primer mensaje hasta que tu mascota esté en casa.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicationSection;
