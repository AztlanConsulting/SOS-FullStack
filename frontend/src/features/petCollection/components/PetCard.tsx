import { Text } from '@/shared/components/ui/Text';

const PetCard = () => {
  return (
    <div className="w-full rounded-xl flex flex-col relative border-2 border-gray-400 overflow-hidden">
      <div className="relative h-64 w-full">
        <img
          alt="Mascota encontrada"
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.TlpTINdNTd_r0DB4ujxoWgHaEo%3Fpid%3DApi&f=1&ipt=0b7e2d83d75ccc510341d34a814caa3c67b4c0af381c21f31e445c7ddba69c4a&ipo=images"
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
