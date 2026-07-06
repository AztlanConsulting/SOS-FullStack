import type { Blog } from '@/features/blog/types/blog.types';
import { Text } from '@/shared/components/ui';
import BlogTitle from './BlogTitle';
import BlogCover from './BlogCover';
import BlogStatus from './BlogStatus';
import BlogContent from './BlogContent';
import useBlog from '../hooks/useBlog';
import { useState } from 'react';
import { ConfirmationModal } from '@/shared/components/ui/Modal/ConfirmationModal';
import BlogModalActions from './BlogModalActions';
import Header from './Header';
import BlogTime from './BlogTime';
import deleteBlog from '../service/deleteBlog.service';

interface Props {
  blog: Blog | undefined;
  edit: boolean;
  setEdit: (b: boolean) => void;
  closeModal: () => void;
  success: () => void;
}

const BlogModal = ({ blog, edit, setEdit, closeModal, success }: Props) => {
  const {
    blocksHook,
    blogChangeset,
    setBlogChangeset,
    handleBlocks,
    updateBlocks,
    coverPreview,
    updateCoverImage,
    validateData,
    errors,
    save,
  } = useBlog(blog, success);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { blocks } = blocksHook;

  const newBlog = edit && !blog;

  return (
    <main
      className="fixed bg-black/10 top-0 left-0 flex items-center z-10 w-screen h-screen"
      onClick={(e) => {
        e.target === e.currentTarget && closeModal();
      }}
    >
      <section className="bg-white w-1/3 h-4/5 overflow-scroll mx-auto rounded-md">
        <Header blog={blogChangeset} closeModal={closeModal} edit={edit} />
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
          {edit && (
            <BlogTitle
              blog={blogChangeset}
              changeTitle={(t: string) => {
                setBlogChangeset((prev) => ({ ...prev, name: t }));
              }}
            />
          )}
          {errors.name && (
            <Text variant="small" color="text-red-500">
              {errors.name}
            </Text>
          )}
          {/* <BlogTags edit={edit} blog={blog} /> */}
          <BlogStatus
            edit={edit}
            statusHook={[
              blogChangeset.active,
              (s: boolean) => {
                setBlogChangeset((prev) => ({ ...prev, active: s }));
              },
            ]}
          />
          <BlogTime
            edit={edit}
            setTime={(n: number) => {
              setBlogChangeset((prev) => ({ ...prev, duration: n }));
            }}
            blog={blogChangeset}
            errors={errors}
          />
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
              closeLabel={'Eliminar'}
              save={() => setEdit(true)}
              close={() => {
                setShowConfirmation(true);
              }}
            />
          )}
          {showConfirmation && edit && (
            <ConfirmationModal
              title={newBlog ? 'Crear blog' : 'Editar blog'}
              description={
                newBlog
                  ? `Crear nuevo blog: ${blogChangeset.name}`
                  : `¿Estas segura de editar este el blog?`
              }
              confirmLabel={newBlog ? 'Si, crear' : 'Sí, editar'}
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
          {showConfirmation && !edit && (
            <ConfirmationModal
              title={'Eliminar blog'}
              description={
                <>
                  <p>¿Estas segura de eliminar este el blog?</p>
                  <p>Este no se podrá restaurar posteriormente.</p>
                  <p className="text-sm text-base-gray">
                    [Recuerda que puedes ponerlo en borrador si buscas
                    ocultarlo]
                  </p>
                </>
              }
              confirmLabel={'Borrar'}
              cancelLabel="Cancelar"
              tone="warning"
              // isLoading={isDeleting}
              // errorMessage={deleteError}
              onConfirm={() => {
                setShowConfirmation(false);
                deleteBlog(blog!._id!);
                success();
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
