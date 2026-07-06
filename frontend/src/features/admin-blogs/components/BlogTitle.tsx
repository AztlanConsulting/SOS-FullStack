import type { Blog } from '@/features/blog/types/blog.types';
import { Text } from '@/shared/components/ui';

interface Props {
  blog: Blog | undefined;
  changeTitle: (s: string) => void;
}

const BlogTitle = ({ blog, changeTitle }: Props) => {
  return (
    <section className="flex flex-col gap-1">
      <Text variant="small" color="text-gray-500">
        Título
      </Text>

      <input
        type="text"
        placeholder="Título del blog"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        value={blog?.name}
        onChange={(e) => changeTitle(e.target.value)}
      />
    </section>
  );
};

export default BlogTitle;
