import { Text } from '@/shared/components/ui';
import type { BlogElement } from '../types/blog.types';
import type { Blog } from '@/features/blog/types/blog.types';

interface Props extends BlogElement {
  blog: Blog | null;
  errors: Record<string, string>;
  setTime: (n: number) => void;
}

const BlogTime = ({ edit, blog, setTime, errors }: Props) => {
  return (
    <section className="flex flex-col gap-1">
      <Text variant="small" color="text-gray-500">
        Duración de lectura (minutos)
      </Text>
      {!edit && (
        <div className={`text-center px-2 w-1/3 py-1 `}>{blog?.duration}</div>
      )}
      {edit && (
        <>
          <input
            type="number"
            min={1}
            max={120}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            onChange={(e) => setTime(parseInt(e.target.value))}
            defaultValue={blog?.duration}
          />
          {errors.duration && (
            <Text variant="small" color="text-red-500">
              {errors.name}
            </Text>
          )}
        </>
      )}
    </section>
  );
};

export default BlogTime;
