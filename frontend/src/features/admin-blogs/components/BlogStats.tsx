import { Text } from '@/shared/components/ui';
import type { BlogStatsSchema } from '../types/blog.types';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';

interface Props {
  blogStats: BlogStatsSchema | undefined;
  isLoading: boolean;
  error: Error | null;
}

const BlogStats = ({ blogStats, isLoading, error }: Props) => {
  const { published, drafts, comparison } = blogStats ?? {
    published: 0,
    drafts: 0,
    comparison: 0,
  };
  const more = comparison > 0;

  return (
    <div className="h-1/4 flex-1 py-5 px-3 border border-gray-300 bg-white my-5 gap-3 rounded-md grid grid-cols-3 col-span-2">
      {!blogStats && isLoading && (
        <div className="col-span-3">
          <LoadingSpinner />
        </div>
      )}
      {!blogStats && error && (
        <div className="flex flex-col col-span-3 text-center">
          <Text variant="h2" weight="semibold" className="text-gray-600 mb-2">
            Error: No se pudieron recuperar las estadísticas
          </Text>
          <Text className="text-center">
            Hubo un error inesperado y las estadísticas no pueden cargar en
            estos momentos
          </Text>
        </div>
      )}
      {blogStats && (
        <>
          <div className="flex-1 bg-base rounded-md grid grid-rows-2 p-5 border border-gray-300">
            <Text
              variant="h1"
              weight="semibold"
              className="text-gray-600 text-5xl!"
            >
              {published + drafts}
            </Text>
            <Text variant="h3" className="text-center">
              Entradas Totales
            </Text>
          </div>
          <div className="flex-1 rounded-md grid grid-rows-2 p-5 border border-gray-300">
            <Text
              variant="h1"
              weight="semibold"
              className={`text-gray-600 text-5xl! ${more ? 'text-green-600' : 'text-red-600'} flex gap-1`}
            >
              {more ? <IoArrowUp /> : <IoArrowDown />} {comparison}
            </Text>
            <Text variant="h3" className="text-center">
              Comparación con el mes pasado
            </Text>
          </div>
          <div className="flex-1 bg-base rounded-md grid grid-rows-2 p-5 border border-gray-300">
            <Text
              variant="h1"
              weight="semibold"
              className="text-gray-600 text-5xl!"
            >
              {published}
            </Text>
            <Text variant="h3" className="text-center">
              Publicados
            </Text>
          </div>{' '}
        </>
      )}
    </div>
  );
};

export default BlogStats;
