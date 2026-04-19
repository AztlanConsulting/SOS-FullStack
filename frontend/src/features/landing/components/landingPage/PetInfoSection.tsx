import { Text } from '@shared/components/ui/Text';
import petAndOwners from '@assets/images/petAndOwners.png';

const PublicationSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-x-8 md:gap-y-0">
          <Text
            as="h2"
            variant="h2"
            weight="medium"
            className="mb-3 md:order-2 text-center md:text-left md:row-span-1 md:place-self-end md:justify-self-start"
          >
            Cuéntanos de tu mascota
          </Text>
          <img
            src={petAndOwners}
            alt="Publicación"
            className="object-cover rounded-lg w-full h-full md:order-1 md:row-span-2"
          />
          <Text
            variant="body"
            className="text-left md:order-3 md:row-span-1 md:place-self-start md:justify-self-start mt-3"
          >
            Déjanos la información de tu mascota para comenzar la búsqueda
          </Text>
        </div>
      </div>
    </section>
  );
};

export default PublicationSection;
