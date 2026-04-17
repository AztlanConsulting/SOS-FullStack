import { Text } from '../../../../shared/components/ui/Text';

const PublicationSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-12">
          <div className="">
            <img
              src="/dog2.png"
              alt="Publicación"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg:text-left order-1 lg:order-2">
            <Text as="h2" variant="h3" weight="medium" className="mb-4 lg:mb-6">
              Tu publicación/anuncio estará visible dentro de un minuto
            </Text>
            <Text variant="body" className="text-left">
              Al registrar la información se hará la publicación con tu forma de
              contacto y tendrás acceso a los manuales y talleres de búsqueda.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicationSection;
