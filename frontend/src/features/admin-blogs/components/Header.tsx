import type { Blog } from '@/features/blog/types/blog.types';
import { Text } from '@/shared/components/ui';
import { HiX } from 'react-icons/hi';
import type { BlogElement } from '../types/blog.types';

interface Props extends BlogElement {
  blog: Blog | undefined;
  closeModal: () => void;
}

const Header = ({ edit, blog, closeModal }: Props) => {
  return (
    <header className="flex justify-between bg-primary relative top-0 left-0 rounded-t-md p-3">
      <div className="">
        {edit ? (
          <>
            <Text color="text-white" variant="h3" weight="semibold">
              {blog ? `Editar: ${blog.name}` : 'Nuevo blog'}
            </Text>
            <Text color="text-white">
              Estas {blog ? 'editando' : 'agregando'} un blog
            </Text>
          </>
        ) : (
          <Text color="text-white" variant="h3" weight="semibold">
            {blog && blog.name}
          </Text>
        )}
      </div>
      <button
        className="rounded-full size-10 text-white flex items-center justify-center"
        onClick={closeModal}
      >
        <HiX className="size-5" />
      </button>
    </header>
  );
};

export default Header;
