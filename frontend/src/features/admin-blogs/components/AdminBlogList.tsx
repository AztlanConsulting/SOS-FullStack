import type { Blog } from '@/features/blog/types/blog.types';
import AdminBlogCard from './AdminBlogCard';

interface Props {
  blogs: Blog[];
  openModal: (id: string) => void;
}

const AdminBlogList = ({ blogs, openModal }: Props) => {
  return (
    // h-138
    <div className="flex flex-col gap-5 w-full px-20 overflow-scroll">
      {blogs.map((b) => (
        <button onClick={() => openModal(b._id)}>
          <AdminBlogCard blog={b} />
        </button>
      ))}
    </div>
  );
};

export default AdminBlogList;
