import BlogContent from '@features/blog/components/BlogContent';
import useGetBlogContent from '@features/blog/hooks/useGetBlogContent';
import queryBlogById from '@features/blog/services/queryBlogById';
import type { Blog } from '@features/blog/types/blog.types';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';

const BlogPage = () => {
  const { isLoading, error, blog } = useGetBlogContent<Blog>(queryBlogById);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <Text>Error no se pudo encontrar el blog especificado</Text>;

  return (
    <div className="min-h-screen">
      <main>
        {blog ? <BlogContent blog={blog} /> : <div>Blog no encontrado</div>}
      </main>
    </div>
  );
};

export default BlogPage;
