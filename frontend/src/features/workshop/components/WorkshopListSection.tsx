import Search from '@shared/components/ui/Search';
import List from '@shared/components/ui/List';
import Pagination from '@shared/components/ui/Pagination';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';
import WorkshopCard from './WorkshopCard';
import { type WorkshopResult, type Workshop } from '../types/workshop';
import useProduct from '@shared/hooks/useProduct';
import queryWorkshop from '../services/queryWorkshops';

const WorkshopListSection = () => {
  const { searchHook, query, pages } = useProduct<WorkshopResult>(
    queryWorkshop,
    'workshops',
  );
  const { isLoading, error, data } = query;

  return (
    <section className="bg-white w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        {/* Filters and search */}
        <Search searchHook={searchHook} />

        {/* State management and list */}
        {isLoading && <LoadingSpinner />}
        {error && <Text>Error cargando resultados de búsqueda</Text>}
        {!isLoading && !error && data && (
          <List<Workshop>
            cards={data.workshops}
            component={(card, idx) => (
              <WorkshopCard workshop={card} key={idx} />
            )}
          />
        )}

        {/* Pagination */}
        {data && <Pagination pages={pages} />}
      </div>
    </section>
  );
};

export default WorkshopListSection;
