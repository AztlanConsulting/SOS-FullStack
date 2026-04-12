import { Text } from '../../../../shared/components/ui/Text';

const PetInfoSection = () => {
  return (
    <section className="bg-white overflow-hidden border-b border-border-gray py-8 lg:py-16">
      <div className="w-full px-4">
        <div className="text-center mb-6 lg:mb-10">
          <Text as="h2" variant="h2" weight="medium">
            Cuéntanos de tu mascota
          </Text>
        </div>

        <div className="max-w-3xl mx-auto">
          <img
            src="/dog-lies-legs-owner-man-pink-shirt-his-beloved-woman-admire-their-white-pet 1.png"
            alt="Tu mascota"
            className="w-full h-[220px] lg:h-[320px] xl:h-[400px] rounded-lg mb-6 lg:mb-8 object-cover"
          />
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <Text variant="body">
            Déjanos la información de tu mascota para comenzar la búsqueda
          </Text>
        </div>
      </div>
    </section>
  );
};

export default PetInfoSection;
