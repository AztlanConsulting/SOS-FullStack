import { Text } from '../../../../shared/components/ui/Text';

const PetInfoSection = () => {
  return (
    <section className="bg-white border-b border-(--color-grey-border) overflow-hidden border-b border-border-gray py-8 lg:py-16">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="text-center mb-6 lg:mb-10">
          <Text as="h2" variant="h2" weight="medium">
            Cuéntanos de tu mascota
          </Text>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-12">
          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg:text-left order-1">
            <Text variant="body">
              Déjanos la información de tu mascota para comenzar la búsqueda
            </Text>
          </div>

          <div className="relative w-[200px] h-[196px] lg:w-[280px] lg:h-[260px] xl:w-[350px] xl:h-[320px] flex-shrink-0 order-2">
            <img
              src="/petAndOwners.png"
              alt="Tu mascota"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetInfoSection;
