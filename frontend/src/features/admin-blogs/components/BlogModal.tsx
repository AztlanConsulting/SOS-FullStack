import type { Blog } from '@/features/blog/types/blog.types';
import { Text } from '@/shared/components/ui';
import { HiX } from 'react-icons/hi';
import BlogTitle from './BlogTitle';
import BlogCover from './BlogCover';
import BlogTags from './BlogTags';
import BlogStatus from './BlogStatus';
import BlogContent from './BlogContent';

interface Props {
  blog: Blog | undefined;
  save: () => void;
  closeModal: () => void;
}

const BlogModal = ({ blog, save, closeModal }: Props) => {
  return (
    <main className="fixed bg-black/10 top-0 left-0 flex items-center z-10 w-screen h-screen">
      <section className="bg-white w-1/3 h-4/5 overflow-scroll mx-auto p-3 rounded-md">
        <header className="flex justify-between">
          <div className="">
            <Text variant="h3" weight="semibold">
              {blog ? `Editar: ${blog.name}` : 'Nueva entrada'}
            </Text>
            <Text>Estas {blog ? 'editando' : 'agregando'} un blog</Text>
          </div>
          <button
            className="rounded-full size-10 text-white bg-base-gray hover:bg-gray-600 flex items-center justify-center"
            onClick={closeModal}
          >
            <HiX className="size-5" />
          </button>
        </header>
        <hr className="w-full my-1" />
        <form className="flex flex-col gap-3">
          <BlogCover />
          <BlogTitle />
          <BlogTags />
          <BlogStatus />
          <BlogContent
            blocks={[]}
            updateBlocks={{
              updateTextBlock: function (idx: number, val: string): void {
                throw new Error('Function not implemented.');
              },
              updateImageBlock: function (idx: number, file: File): void {
                throw new Error('Function not implemented.');
              },
            }}
            handleBlocks={{
              handleAddBlock: function (): void {
                throw new Error('Function not implemented.');
              },
              removeBlock: function (idx: number): void {
                throw new Error('Function not implemented.');
              },
            }}
          />
        </form>
      </section>
    </main>
  );
};

export default BlogModal;
