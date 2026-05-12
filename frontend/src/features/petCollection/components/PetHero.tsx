import type { PetInfoDetailed } from '../types/petCollection.types';
import { Text } from '@/shared/components/ui/Text';

interface Props {
  petInfo: PetInfoDetailed;
}

const PetHero = ({ petInfo }: Props) => {
  return (
    <section
      className={`bg-secondary w-full flex flex-col items-center justify-center`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-x-16 my-4 md:my-8 w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        <div className="order-1 md:order-2 md:place-self-end md:justify-self-start mb-3">
          <Text
            as="h1"
            variant="h1"
            weight="medium"
            color="text-black"
            className="text-left"
          >
            {petInfo.species}
          </Text>
          <Text
            as="h2"
            variant="h2"
            color="text-gray-600"
            className="text-left"
          >
            {petInfo.breed}
          </Text>
        </div>

        <div className="order-2 md:order-1 md:row-span-2 my-3 md:my-0">
          <img
            src={petInfo.image}
            alt="Manuales"
            className="w-full rounded-lg object-cover color-primary-shadow "
          />
        </div>
      </div>
      <div className="order-3 md:order-3 md:place-self-start md:justify-self-start mt-3" />
    </section>
  );
};

export default PetHero;
