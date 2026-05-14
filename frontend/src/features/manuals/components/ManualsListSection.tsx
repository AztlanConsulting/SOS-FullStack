import { ManualItem } from './ManualItem';
import type { Manual, ManualResult } from '../types/Manual.type';
import { Text } from '@shared/components/ui/Text/Text';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import queryManual from '../services/queryManuals';
import useProduct from '@shared/hooks/useProduct';
import Search from '@shared/components/ui/Search';
import List from '@shared/components/ui/List';
import Pagination from '@shared/components/ui/Pagination';
import { useLocationContext } from '@/shared/context/Location.context';

export const ManualsListSection = () => {
  const { searchHook, query, pages } = useProduct<ManualResult>(
    queryManual,
    'manuals',
  );
  const { isLoading, error, data } = query;
  const { manuals: localizedManuals, currencyCode } = useLocationContext();
  const getlocalizedPrice = (name: string, fallback: number): number => {
    const found = localizedManuals.find((m) => m.name === name);
    return found?.localizedPrice ?? fallback;
  };

  return (
    <section className="bg-secondary w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        {/* Filters and search */}
        <Search searchHook={searchHook} />

        {/* State management and list */}
        {isLoading && <LoadingSpinner />}
        {error && (
          <Text className="mb-60 mt-40">
            Error cargando resultados de búsqueda
          </Text>
        )}
        {!isLoading && !error && data && (
          <List<Manual>
            cards={data.manuals}
            component={(card, idx) => (
              <ManualItem
                manual={card}
                localizedPrice={getlocalizedPrice(card.name, card.price)}
                currencyCode={currencyCode}
                key={idx}
              />
            )}
          />
        )}

        {data && data.manuals.length == 0 && (
          <Text className="mb-20">No hay resultados...</Text>
        )}

        {/* Pagination */}
        {data && data.manuals.length > 0 && <Pagination pages={pages} />}
      </div>
    </section>
  );
};
