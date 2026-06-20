import type { Blog } from '@/features/blog/types/blog.types';
import AdminBlogCard from './AdminBlogCard';

interface Props {
  blogs: Blog[];
}

const AdminBlogList = ({ blogs }: Props) => {
  return (
    <div className="flex flex-col gap-5 w-full px-20">
      {blogs.map((b) => (
        <AdminBlogCard blog={b} />
      ))}
    </div>
  );
};

export default AdminBlogList;
