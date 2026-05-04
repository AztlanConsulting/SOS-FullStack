import { Text } from '@/shared/components/ui/Text';

interface Props {
  img: string;
}

const PetCard = ({ img }: Props) => {
  const image = `data:image/png;base64,${img}`;
  console.log(image);

  return (
    <div className="w-full rounded-xl flex flex-col relative border-2 border-gray-400 overflow-hidden max-h-96">
      <div className="relative h-64 w-full">
        <img
          alt="Mascota encontrada"
          src={image}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-2 border-2 border-green-400 bg-green-100 p-0.5 rounded-sm">
          <Text variant="small" color="green-400">
            Encontrado
          </Text>
        </div>
      </div>

      <section className="w-full bg-white divide-y-2 divide-gray-400">
        <div className="flex flex-col px-2 py-1">
          <Text variant="h2" weight="semibold">
            Snow
          </Text>
          <Text className="text-gray-500 -mt-1">Huskey</Text>
        </div>
        <div className="px-2 py-1">
          <Text className="text-gray-500">Querétaro</Text>
        </div>
      </section>
    </div>
  );
};

export default PetCard;
