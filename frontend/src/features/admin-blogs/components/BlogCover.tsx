import type { Blog } from '@/features/blog/types/blog.types';
import { Text } from '@/shared/components/ui';
import { HiPhotograph } from 'react-icons/hi';
import type { BlogElement } from '../types/blog.types';

interface Props extends BlogElement {
  blog: Blog | undefined;
  changeImage: () => void;
}

const BlogCover = ({ edit, blog, changeImage }: Props) => {
  return (
    // Cover
    <section className="flex flex-col gap-2">
      <Text variant="small" color="text-gray-500">
        Imagen de portada
      </Text>

      {blog && <img src={blog.imageUrl} className="rounded-md" />}
      {edit &&
        (blog ? (
          <button
            type="button"
            className="border-2 border-dashed border-gray-300 rounded-md py-2 flex items-center text-gray-400 hover:border-yellow-400 hover:text-yellow-500 justify-center gap-5"
            onClick={changeImage}
          >
            <HiPhotograph size={24} />
            <span>Cambiar portada</span>
          </button>
        ) : (
          <button
            type="button"
            className="border-2 border-dashed border-gray-300 rounded-md py-8 flex flex-col items-center text-gray-400 hover:border-yellow-400 hover:text-yellow-500"
            onClick={changeImage}
          >
            <HiPhotograph size={24} />
            <span>Seleccionar portada</span>
          </button>
        ))}
    </section>
  );
};

export default BlogCover;
