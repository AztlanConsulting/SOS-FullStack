import { Text } from '@/shared/components/ui';
import { useState } from 'react';

const BlogTags = () => {
  const [tags, setTags] = useState([]);
  return (
    <section className="flex flex-col gap-2">
      <Text variant="small" color="text-gray-500">
        Etiquetas
      </Text>

      <input
        type="text"
        placeholder="Presiona Enter para agregar etiquetas"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
      />

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm"
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
};

export default BlogTags;
