import { Text } from '@/shared/components/ui';

const BlogTitle = () => {
  return (
    <section className="flex flex-col gap-1">
      <Text variant="small" color="text-gray-500">
        Título
      </Text>

      <input
        type="text"
        placeholder="Título del blog"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
    </section>
  );
};

export default BlogTitle;
