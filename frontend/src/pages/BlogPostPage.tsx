import BlogContent from '@features/blog/components/BlogContent';
import useGetBlogContent from '@features/blog/hooks/useGetBlogContent';
import queryBlogById from '@features/blog/services/queryBlogById';
import type { Blog } from '@features/blog/types/blog.types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const BlogPage = () => {
  const { blog } = useGetBlogContent<Blog>(queryBlogById);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsOpen(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    window.setTimeout(() => {
      navigate(-1);
    }, 280);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      <main
        className={`absolute top-0 right-0 h-full w-full bg-white shadow-2xl overflow-y-auto pointer-events-auto transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {blog ? (
          <BlogContent blog={blog} onBack={handleClose} />
        ) : (
          <div className="p-8">Blog no encontrado</div>
        )}
      </main>
    </div>
  );
};

export default BlogPage;
