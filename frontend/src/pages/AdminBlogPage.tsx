import AdminBlogHeader from '@/features/admin-blogs/components/AdminBlogHeader';
import AdminBlogList from '@/features/admin-blogs/components/AdminBlogList';
import BlogModal from '@/features/admin-blogs/components/BlogModal';
import BlogStats from '@/features/admin-blogs/components/BlogStats';
import getBlogStats from '@/features/admin-blogs/service/getBlogStats.service';
import queryBlog from '@/features/blog/services/queryBlog';
import type { BlogResult } from '@/features/blog/types/blog.types';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import Error from '@/shared/components/ui/Error';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import { Modal } from '@/shared/components/ui/Modal/Modal';
import Pagination from '@/shared/components/ui/Pagination';
import useProduct from '@/shared/hooks/useProduct';
import trace from '@assets/images/trace.svg';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const AdminBlogPage = () => {
  // Should be a hook but idgaf
  const [success, setSuccess] = useState(false);
  const { searchHook, query, pages, setActive } = useProduct<BlogResult>(
    queryBlog,
    'blogs',
    [success],
  );
  const {
    isLoading: statsLoading,
    error: statsError,
    data: blogStats,
  } = useQuery({
    queryKey: ['blog-stats'],
    queryFn: async () => await getBlogStats(),
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);

  const { state } = useParams();

  useEffect(() => {
    if (!state) setActive(null);
    else if (state == 'publicados') setActive(true);
    else if (state == 'borrados') setActive(false);
  }, [state, setActive]);

  function handleOpenModal(id?: string) {
    setShowModal(true);
    id && setSelectedBlog(id);
  }

  function handleCloseModal() {
    if ((edit && !selectedBlog) || (!edit && selectedBlog)) {
      setShowModal(false);
      setSelectedBlog(null);
    }
    setEdit(false);
  }

  const { isLoading, error } = query;
  const blogs = query.data?.blogs;

  // Component structure
  return (
    <div className="flex h-screen bg-base overflow-x-hidden w-full">
      <Sidebar />
      <main className="relative flex-1 p-4 lg:p-6 pb-24 lg:pb-6 flex flex-col gap-6 min-w-0 overflow-x-hidden lg:ml-64 ">
        <img
          src={trace}
          alt=""
          className="absolute size-144 right-0 top-80 z-0 pointer-events-none"
        />
        <div className="relative z-10">
          <AdminBlogHeader
            searchHook={searchHook}
            createBlog={() => {
              setShowModal(true);
              setEdit(true);
            }}
            blogStats={blogStats}
          />
          <hr className="w-2/3" />
          <section className="grid grid-cols-2 mt-5 gap-5">
            <div className="overflow-x-scroll">
              {!blogs && isLoading && <LoadingSpinner />}
              {!blogs && error && (
                <Error
                  title={'Error buscando blogs'}
                  message={'No se pudieron recuperar los blogs'}
                />
              )}
              {blogs && blogs.length == 0 && (
                <Error
                  title={'No se encontraron publicaciones'}
                  message={
                    'No hay entradas que coincidan con los filtros seleccionados.'
                  }
                />
              )}
              {blogs && blogs.length > 0 && (
                <>
                  <AdminBlogList blogs={blogs} openModal={handleOpenModal} />
                  <Pagination pages={pages} />
                </>
              )}
            </div>

            <BlogStats
              blogStats={blogStats}
              isLoading={statsLoading}
              error={statsError}
            />
          </section>
        </div>
        {showModal && (
          <BlogModal
            blog={blogs && blogs.filter((b) => b._id == selectedBlog)[0]}
            edit={edit}
            setEdit={setEdit}
            closeModal={handleCloseModal}
            success={() => {
              setShowModal(false);
              setSuccess(true);
            }}
          />
        )}
      </main>
      {success && (
        <Modal
          title={
            edit
              ? 'El blog se ha actualizado correctamente'
              : 'Se ha creado un nuevo blog'
          }
          onClose={() => {
            setSuccess(false);
            setEdit(false);
          }}
        >
          El blog se ha {edit ? 'editado' : 'creado'} correctamente.
        </Modal>
      )}
    </div>
  );
};

export default AdminBlogPage;
