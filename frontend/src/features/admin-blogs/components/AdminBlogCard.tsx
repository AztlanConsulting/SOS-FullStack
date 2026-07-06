import type { Blog } from '@/features/blog/types/blog.types';
import { Text } from '@/shared/components/ui';

interface Props {
  blog: Blog;
}

const AdminBlogCard = ({ blog }: Props) => {
  const currDate = new Date();
  const newDate = new Date(blog.updatedAt);
  const diffTime = Math.abs(currDate.getTime() - newDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const day = new Date(blog.updatedAt).getDate();
  const month = new Date(blog.updatedAt).getMonth() + 1;
  const year = new Date(blog.updatedAt).getFullYear();

  const setDay = day < 10 ? '0' + day : day;
  const setMonth = month < 10 ? '0' + month : month;

  const formattedDate = `${setDay}/${setMonth}/${year}`;

  return (
    <div className="relative h-42 rounded-md hover:shadow-lg shadow-base-gray">
      <img src={blog.imageUrl} alt="" className="size-full object-cover" />

      <div className="absolute bottom-0 left-0 right-0 min-h-1/4 max-h-1/3 h-fit bg-white p-2 flex justify-between items-center gap-2">
        <Text>
          {blog.name.length > 40 ? blog.name.slice(0, 37) + '...' : blog.name}
        </Text>
        <div className="flex gap-10 items-center">
          <div
            className={`text-center px-2 py-1 border-1 ${blog.active ? 'bg-green-400 border-green-600 text-green-600' : 'bg-base border-base-gray text-base-gray'} rounded-full`}
          >
            {blog.active ? 'Publicado' : 'Borrador'}
          </div>
          <Text variant="caption" color="text-base-gray">
            {diffDays < 15 ? `Hace ${diffDays} días` : formattedDate}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogCard;
