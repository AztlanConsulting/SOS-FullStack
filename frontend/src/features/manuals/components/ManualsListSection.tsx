import { ManualItem } from './ManualItem';
import type { Manual, ManualResult } from '../types/Manual.type';
import { Text } from '@shared/components/ui/Text/Text';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import queryManual from '../services/queryManuals';
import useProduct from '@shared/hooks/useProduct';
import Search from '@shared/components/ui/Search';
import List from '@shared/components/ui/List';
import Pagination from '@shared/components/Pagination';

export const ManualsListSection = () => {
  const { searchHook, query, pages } = useProduct<ManualResult>(queryManual);
  const { isLoading, error, data } = query;

  return (
    <section className="color-secondary-bg w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        {/* Filters and search */}
        <Search searchHook={searchHook} />

        {/* State management and list */}
        {isLoading && <LoadingSpinner />}
        {error && <Text>Error cargando resultados de búsqueda</Text>}
        {!isLoading && !error && data && (
          <List<Manual>
            cards={data.manuals}
            component={(card, idx) => <ManualItem manual={card} key={idx} />}
          />
        )}

        {/* Pagination */}
        {data && <Pagination pages={pages} />}
      </div>
    </section>
  );
};
