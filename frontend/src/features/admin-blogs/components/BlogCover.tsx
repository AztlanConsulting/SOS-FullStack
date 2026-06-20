import { Text } from '@/shared/components/ui';
import { HiPhotograph } from 'react-icons/hi';

const BlogCover = () => {
  return (
    // Cover
    <section className="flex flex-col gap-2">
      <Text variant="small" color="text-gray-500">
        Imagen de portada
      </Text>

      <button
        type="button"
        className="border-2 border-dashed border-gray-300 rounded-md py-8 flex flex-col items-center text-gray-400 hover:border-yellow-400 hover:text-yellow-500"
      >
        <HiPhotograph size={24} />
        <span>Seleccionar portada</span>
      </button>
    </section>
  );
};

export default BlogCover;
