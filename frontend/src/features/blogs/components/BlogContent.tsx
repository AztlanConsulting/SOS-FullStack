import type { Blog } from '../types/blog.types';
import { HeaderBack } from '@shared/components/layout/HeaderBack';
import { useNavigate } from 'react-router';
import ContentRenderer from '@shared/components/ui/ContentRenderer';
import BlogHeader from './BlogHeader';

interface Props {
  blog: Blog;
}

const BlogContent = ({ blog }: Props) => {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-screen flex flex-col">
      <HeaderBack name="Blog" onBack={() => navigate('/blog')} />
      <BlogHeader blog={blog} />;
      <div className="w-full bg-white flex justify-center py-6 md:py-10">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-2xl xl:max-w-2xl flex flex-col gap-6">
          <ContentRenderer content={blog.content} />
        </div>
      </div>
    </section>
  );
};

export default BlogContent;
