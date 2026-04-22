import Search from '@shared/components/ui/Search';
import List from '@shared/components/ui/List';
import Pagination from '@shared/components/ui/Pagination';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';
import BlogCard from './BlogCard';
import type { BlogResult, Blog } from '../types/blog.types';
import useProduct from '@shared/hooks/useProduct';
import queryBlog from '../services/queryBlogs';

const BlogListSection = () => {
  const { searchHook, query, pages } = useProduct<BlogResult>(
    queryBlog,
    'blogs',
  );
  const { isLoading, error, data } = query;
  const blogs = Array.isArray(data?.blogs) ? data.blogs : [];

  return (
    <section className="bg-secondary w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        {/* Filters and search */}
        <Search searchHook={searchHook} />

        {/* State management and list */}
        {isLoading && <LoadingSpinner />}
        {error && (
          <Text className="mb-60 mt-40">
            Error cargando resultados de búsqueda
          </Text>
        )}
        {data && blogs.length == 0 && (
          <Text className="mb-20">No hay resultados...</Text>
        )}
        {!isLoading && !error && data && (
          <List<Blog>
            cards={blogs}
            component={(card, idx) => <BlogCard blog={card} key={idx} />}
          />
        )}

        {/* Pagination */}
        {data && blogs.length > 0 && <Pagination pages={pages} />}
      </div>
    </section>
  );
};

export default BlogListSection;
