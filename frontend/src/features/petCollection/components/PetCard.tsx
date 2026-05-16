import { Text } from '@/shared/components/ui/Text';
import type { PetInfo } from '../types/petCollection.types';
import { Link } from 'react-router';

interface Props {
  petInfo: PetInfo;
}

const PetCard = ({ petInfo }: Props) => {
  const image = `data:image/png;base64,${petInfo.image}`;

  return (
    <Link
      className="w-full rounded-xl flex flex-col relative border-2 border-gray-400 overflow-hidden cursor-pointer max-h-80 bg-white"
      to={`/inicio/coleccion-mascotas/${petInfo.refId}`}
    >
      <div className="relative h-56 w-full">
        <img
          alt="Mascota encontrada"
          src={image}
          className="w-full md:max-h-56 h-full object-cover"
        />
        <div className="absolute bottom-4 left-2 border-2 border-green-700 bg-green-100 p-0.5 px-1.5 rounded-md">
          <Text variant="small" color="text-green-700">
            Encontrado
          </Text>
        </div>
      </div>

      <section className="w-full bg-white divide-y-2 divide-gray-400">
        <div className="flex flex-col p-2">
          <Text variant="h4">{petInfo.species}</Text>
        </div>
        <div className="px-2 py-1">
          <Text className="text-gray-500">{petInfo.location}</Text>
        </div>
      </section>
    </Link>
  );
};

export default PetCard;
