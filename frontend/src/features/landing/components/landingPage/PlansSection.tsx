import { Text } from '../../../../shared/components/ui/Text';

const PlansSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row-reverse items-center lg:justify-between gap-8 lg:gap-12">
          <div className="">
            <img
              src="/cat.png"
              alt="Planes"
              className="object-contain rounded-lg w-[250px] h-[250px]"
            />
          </div>

          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg:text-left order-1 lg:order-2">
            <Text as="h2" variant="h3" weight="medium" className="mb-4 lg:mb-6">
              Elige el plan que te acomode.
            </Text>
            <Text variant="body" className="text-left">
              En SOS ofrecemos diferentes planes de alcance y seguimiento, para
              que puedas tener un plan personalizado que se ajuste a tus
              necesidades.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
