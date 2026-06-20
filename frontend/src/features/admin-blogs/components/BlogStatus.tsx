import { Text } from '@/shared/components/ui';

const BlogStatus = () => {
  return (
    <section className="flex flex-col gap-1">
      <Text variant="small" color="text-gray-500">
        Estado
      </Text>

      <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
        <option value="true">Publicado</option>
        <option value="false">Borrador</option>
      </select>
    </section>
  );
};

export default BlogStatus;
