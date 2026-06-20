import AdminBlogHeader from '@/features/admin-blogs/components/AdminBlogHeader';
import AdminBlogList from '@/features/admin-blogs/components/AdminBlogList';
import BlogModal from '@/features/admin-blogs/components/BlogModal';
import BlogStats from '@/features/admin-blogs/components/BlogStats';
import queryBlog from '@/features/blog/services/queryBlog';
import type { BlogResult } from '@/features/blog/types/blog.types';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import Error from '@/shared/components/ui/Error';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import Pagination from '@/shared/components/ui/Pagination';
import useProduct from '@/shared/hooks/useProduct';
import trace from '@assets/images/trace.svg';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const AdminBlogPage = () => {
  const { searchHook, query, pages, setActive } = useProduct<BlogResult>(
    queryBlog,
    'blogs',
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);

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

  function handleSave() {}

  function handleCloseModal() {
    setShowModal(false);
    setSelectedBlog(null);
  }

  const { isLoading, error } = query;
  const blogs = query.data?.blogs;

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
          <AdminBlogHeader searchHook={searchHook} />
          <hr className="w-2/3" />
          <section className="grid grid-cols-5 mt-5 gap-5">
            <div className="col-span-3 overflow-x-scroll ">
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

            <BlogStats />
          </section>
        </div>
        {showModal && (
          <BlogModal
            blog={blogs && blogs.filter((b) => b._id == selectedBlog)[0]}
            save={handleSave}
            closeModal={handleCloseModal}
          />
        )}
      </main>
    </div>
  );
};

export default AdminBlogPage;
