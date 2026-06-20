import type { Blog } from '@/features/blog/types/blog.types';
import { Button, Text } from '@/shared/components/ui';
import { HiX } from 'react-icons/hi';
import BlogTitle from './BlogTitle';
import BlogCover from './BlogCover';
import BlogTags from './BlogTags';
import BlogStatus from './BlogStatus';
import BlogContent from './BlogContent';
import useBlog from '../hooks/useBlog';
import { useState } from 'react';
import { ConfirmationModal } from '@/shared/components/ui/Modal/ConfirmationModal';
import BlogModalActions from './BlogModalActions';

interface Props {
  blog: Blog | undefined;
  edit: boolean;
  save: () => void;
  closeModal: () => void;
}

const BlogModal = ({ blog, save, closeModal }: Props) => {
  const { blocksHook, statusHook, handleBlocks } = useBlog(blog);
  const [editBlog, seteEditBlog] = useState(blog);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [edit, setEdit] = useState(false);
  const { blocks } = blocksHook;
  const loading = false;

  return (
    <main
      className="fixed bg-black/10 top-0 left-0 flex items-center z-10 w-screen h-screen"
      onClick={(e) => {
        e.target === e.currentTarget && closeModal();
      }}
    >
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
        <hr className="w-full my-1 mb-3" />
        <form className="flex flex-col gap-3">
          <BlogCover edit={edit} blog={blog} changeImage={() => {}} />
          {edit && <BlogTitle blog={blog} changeTitle={() => {}} />}
          {/* <BlogTags edit={edit} blog={blog} /> */}
          <BlogStatus edit={edit} statusHook={statusHook} />
          <BlogContent
            edit={edit}
            blocks={blocks}
            updateBlocks={{
              updateTextBlock: function (idx: number, val: string): void {
                throw new Error('Function not implemented.');
              },
              updateImageBlock: function (idx: number, file: File): void {
                throw new Error('Function not implemented.');
              },
            }}
            handleBlocks={handleBlocks}
          />
          {/* ── Actions ── */}
          {edit ? (
            <BlogModalActions
              loading={false}
              successLabel={'Guardar'}
              closeLabel={'Cancelar'}
              save={() => setShowConfirmation(true)}
              close={() => setEdit(false)}
            />
          ) : (
            <BlogModalActions
              loading={false}
              successLabel={'Editar'}
              closeLabel={'Cancelar'}
              save={() => setEdit(true)}
              close={close}
            />
          )}
          {showConfirmation && (
            <ConfirmationModal
              title="Editar recurso"
              description={`¿Estas seguro de editar este el blog?`}
              confirmLabel="Sí, editar"
              cancelLabel="Cancelar"
              tone="warning"
              // isLoading={isDeleting}
              // errorMessage={deleteError}
              onConfirm={() => {
                setShowConfirmation(false);
                save();
              }}
              onCancel={() => {
                setShowConfirmation(false);
              }}
            />
          )}
        </form>
      </section>
    </main>
  );
};

export default BlogModal;
