import { Text } from '../../../shared/components/ui/Text';
import sadDog from '@assets/images/sadDog.png';

const FoundInfo = () => {
  return (
    <section className="relative color-secondary-bg overflow-hidden py-8 lg:py-16">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex-1 max-w-xl lg:max-w-2xl order-2 lg:order-1 text-left">
            <Text as="h1" variant="h1" weight="medium" className="mb-4 lg:mb-6">
              Encontraste una mascota perdida?
            </Text>
            <Text variant="body" weight="regular" className="mb-8 lg:mb-10">
              Si encontraste una mascota y no sabes qué hacer, estás en el lugar
              correcto. Ayuda a reunirla con su familia publicando la
              información aquí.
            </Text>
          </div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <img
              src={sadDog}
              alt="Mascota"
              className="w-[330px] h-[186px] lg:w-[380px] lg:h-[210px] rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundInfo;
