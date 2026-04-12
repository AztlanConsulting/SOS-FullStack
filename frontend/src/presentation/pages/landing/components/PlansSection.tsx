import { Text } from '../../../../shared/components/ui/Text';

const PlansSection = () => {
  return (
    <section className="bg-white p-8 lg:p-16">
      <div className="w-full px-4">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-12">
          <div className="relative w-[200px] h-[196px] lg:w-[280px] lg:h-[260px] xl:w-[350px] xl:h-[320px] flex-shrink-0 order-1 lg:order-2">
            <img
              src="/perro.png"
              alt="Planes"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg:text-left order-2 lg:order-1">
            <Text as="h2" variant="h3" weight="medium" className="mb-4 lg:mb-6">
              Elige el plan que te acomode
            </Text>
            <Text variant="body" className="text-left">
              En SOS ofrecemos diferentes planes de alcance y seguimiento, para
              que puedas tener un plan personalizado que se ajuste a tus
              necesidades
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
