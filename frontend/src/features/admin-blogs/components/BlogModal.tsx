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
import Header from './Header';

interface Props {
  blog: Blog | undefined;
  edit: boolean;
  setEdit: (b: boolean) => void;
  closeModal: () => void;
}

const BlogModal = ({ blog, edit, setEdit, closeModal }: Props) => {
  const {
    blocksHook,
    statusHook,
    handleBlocks,
    updateBlocks,
    coverPreview,
    updateCoverImage,
    validateData,
    errors,
    setTitle,
    save,
  } = useBlog(blog);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { blocks } = blocksHook;

  return (
    <main
      className="fixed bg-black/10 top-0 left-0 flex items-center z-10 w-screen h-screen"
      onClick={(e) => {
        e.target === e.currentTarget && closeModal();
      }}
    >
      <section className="bg-white w-1/3 h-4/5 overflow-scroll mx-auto rounded-md">
        <Header blog={blog} closeModal={closeModal} edit={edit} />
        <form className="flex flex-col gap-3 p-3">
          <BlogCover
            edit={edit}
            coverPreview={coverPreview}
            changeImage={updateCoverImage}
          />
          {errors.coverImage && (
            <Text variant="small" color="text-red-500">
              {errors.coverImage}
            </Text>
          )}
          {edit && <BlogTitle blog={blog} changeTitle={setTitle} />}
          {errors.name && (
            <Text variant="small" color="text-red-500">
              {errors.name}
            </Text>
          )}
          {/* <BlogTags edit={edit} blog={blog} /> */}
          <BlogStatus edit={edit} statusHook={statusHook} />
          <BlogContent
            edit={edit}
            blocks={blocks}
            updateBlocks={updateBlocks}
            handleBlocks={handleBlocks}
            errors={errors}
          />
          {/* ── Actions ── */}
          {edit ? (
            <BlogModalActions
              loading={false}
              successLabel={'Guardar'}
              closeLabel={'Cancelar'}
              save={() => {
                if (Object.keys(validateData()).length > 0) return;
                setShowConfirmation(true);
              }}
              close={closeModal}
            />
          ) : (
            <BlogModalActions
              loading={false}
              successLabel={'Editar'}
              closeLabel={'Cancelar'}
              save={() => setEdit(true)}
              close={closeModal}
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
