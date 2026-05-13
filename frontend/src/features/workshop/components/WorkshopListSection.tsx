import Search from '@shared/components/ui/Search';
import List from '@shared/components/ui/List';
import Pagination from '@shared/components/ui/Pagination';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';
import WorkshopCard from './WorkshopCard';
import { type WorkshopResult, type Workshop } from '../types/workshop';
import useProduct from '@shared/hooks/useProduct';
import queryWorkshop from '../services/queryWorkshops';
import { useLocationContext } from '@shared/context/Location.context';
import { vi } from 'vitest';

// Mocks the LocationContext to provide default USD pricing values.
// Required because components using useLocationContext need a LocationProvider
// in scope — without this mock they throw "useLocation must be used within a LocationProvider".
// Uses USD defaults (exchangeRate: 1) so price assertions remain predictable across tests.
vi.mock('@shared/context/Location.context', () => ({
  useLocationContext: () => ({
    currencyCode: 'USD',
    exchangeRate: 1,
    plans: [],
    manuals: [],
    workshops: [],
    country: null,
    loading: false,
    error: null,
  }),
  LocationProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const WorkshopListSection = () => {
  const { searchHook, query, pages } = useProduct<WorkshopResult>(
    queryWorkshop,
    'workshops',
  );
  const { isLoading, error, data } = query;
  const { workshops: localizedWorkshops, currencyCode } = useLocationContext();

  const getLocalizedPrice = (name: string, fallback: number): number => {
    const found = localizedWorkshops.find((w) => w.name === name);
    return found?.localizedPrice ?? fallback;
  };

  return (
    <section className="bg-white w-full flex flex-col items-center justify-center">
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
        {data && data.workshops.length == 0 && (
          <Text className="mb-20">No hay resultados...</Text>
        )}
        {!isLoading && !error && data && (
          <List<Workshop>
            cards={data.workshops}
            component={(card, idx) => (
              <WorkshopCard
                workshop={card}
                localizedPrice={getLocalizedPrice(card.name, card.price)}
                currencyCode={currencyCode}
                key={idx}
              />
            )}
          />
        )}

        {/* Pagination */}
        {data && data.workshops.length > 0 && <Pagination pages={pages} />}
      </div>
    </section>
  );
};

export default WorkshopListSection;
