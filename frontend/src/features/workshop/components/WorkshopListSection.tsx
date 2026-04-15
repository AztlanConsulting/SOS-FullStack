import axiosInstance from '@shared/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type SetStateAction } from 'react';
import WorkshopSearch from './WorkshopSearch';
import WorkshopList from './WorkshopList';
import WorkshopPagination from './WorkshopPagination';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';

const WorkshopListSection = () => {
  const pageHook = useState(1);
  const page = pageHook[0];
  const [search, setSearch] = useState('');

  const { isLoading, error, data } = useQuery({
    queryKey: ['workshops', page],
    queryFn: async () => {
      const response = await axiosInstance.get(`/workshop?page=${page}`);
      console.log(response.data);

      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      console.log(data.length);
      console.log(new Array(data.length).map((_, idx) => idx + 1));
      console.log(data.length / 10);
    }
  }, [data]);

  return (
    <section className="bg-white w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        <WorkshopSearch />
        {isLoading && <LoadingSpinner />}
        {error && <Text>Error</Text>}
        {!isLoading && !error && <WorkshopList cards={data} />}
        {data && (
          <WorkshopPagination
            length={data.length}
            visiblePages={new Array(data.length).map((_, idx) => idx + 1)}
            totalPages={data.length / 10}
            pageHook={pageHook}
          />
        )}
      </div>
    </section>
  );
};

export default WorkshopListSection;
