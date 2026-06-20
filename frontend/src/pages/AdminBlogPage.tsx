import AdminBlogHeader from '@/features/admin-blogs/components/AdminBlogHeader';
import AdminBlogList from '@/features/admin-blogs/components/AdminBlogList';
import BlogStats from '@/features/admin-blogs/components/BlogStats';
import queryBlog from '@/features/blog/services/queryBlog';
import type { BlogResult } from '@/features/blog/types/blog.types';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import Pagination from '@/shared/components/ui/Pagination';
import useProduct from '@/shared/hooks/useProduct';
import trace from '@assets/images/trace.svg';
import { Text } from '@shared/components/ui/Text/Text';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';

const AdminBlogPage = () => {
  const { searchHook, query, pages, setActive } = useProduct<BlogResult>(
    queryBlog,
    'blogs',
  );

  const { state } = useParams();

  useEffect(() => {
    if (!state) setActive(null);
    else if (state == 'publicados') setActive(true);
    else if (state == 'borrados') setActive(false);
  }, [state, setActive]);

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
          <AdminBlogHeader />
          <hr className="w-2/3" />
          <section className="grid grid-cols-5 mt-5 gap-5">
            {!blogs && isLoading && <LoadingSpinner />}
            {!blogs && error && (
              <Text className="mb-60 mt-40">
                Error cargando resultados de búsqueda
              </Text>
            )}
            {blogs && blogs.length == 0 && (
              <Text className="mb-20">No hay resultados...</Text>
            )}
            {blogs && blogs.length > 0 && (
              <div className="col-span-3 overflow-x-scroll ">
                <AdminBlogList blogs={blogs} />
                <Pagination pages={pages} />
              </div>
            )}

            <BlogStats />
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminBlogPage;
