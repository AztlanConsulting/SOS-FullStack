import axiosInstance from '@shared/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import WorkshopSearch from './WorkshopSearch';
import WorkshopList from './WorkshopList';
import WorkshopPagination from './WorkshopPagination';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';

const WorkshopListSection = () => {
  const pageHook = useState(1);
  const page = pageHook[0];
  // const [search, setSearch] = useState('');

  const { isLoading, error, data } = useQuery({
    queryKey: ['workshops', page],
    queryFn: async () => {
      const response = await axiosInstance.get(`/workshop`, {
        params: {
          page: page - 1,
        },
      });

      return response.data;
    },
  });

  return (
    <section className="bg-white w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        {/* Filters and search */}
        <WorkshopSearch />

        {/* State management and list */}
        {isLoading && <LoadingSpinner />}
        {error && <Text>Error cargando resultados de búsqueda</Text>}
        {!isLoading && !error && <WorkshopList cards={data.workshops} />}

        {/* Pagination */}
        {data && (
          <WorkshopPagination
            visiblePages={new Array(Math.ceil(data.totalWorkshops / 6))
              .fill(0)
              .map((_, idx) => idx + 1)}
            totalPages={Math.ceil(data.totalWorkshops / 6)}
            pageHook={pageHook}
          />
        )}
      </div>
    </section>
  );
};

export default WorkshopListSection;
