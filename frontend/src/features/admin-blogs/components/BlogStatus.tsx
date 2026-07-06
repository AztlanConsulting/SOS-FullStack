import { Text } from '@/shared/components/ui';
import type { BlogElement } from '../types/blog.types';

interface Props extends BlogElement {
  statusHook: [boolean, (b: boolean) => void];
}

const BlogStatus = ({ edit, statusHook }: Props) => {
  const [status, setStatus] = statusHook;
  return (
    <section className="flex flex-col gap-1">
      <Text variant="small" color="text-gray-500">
        Estado
      </Text>
      {!edit && (
        <div
          className={`text-center px-2 w-1/3 py-1 border-1 ${status ? 'bg-green-400 border-green-600 text-green-600' : 'bg-base border-base-gray text-base-gray'} rounded-full`}
        >
          {status ? 'Publicado' : 'Borrador'}
        </div>
      )}
      {edit && (
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          onChange={(e) => setStatus(e.target.value == 'true')}
          defaultValue={String(status)}
        >
          <option value="true">Publicado</option>
          <option value="false">Borrador</option>
        </select>
      )}
    </section>
  );
};

export default BlogStatus;
