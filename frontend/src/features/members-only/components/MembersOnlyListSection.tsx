import List from '@shared/components/ui/List';
import MembersOnlyCard from './MembersOnlyCard';
import type {
  MembersOnly,
  MembersOnlyResult,
} from '../types/membersOnly.types';
import { getMembersOnlyList } from '../services/membersOnly.service';
import useProduct from '@shared/hooks/useProduct';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';
import Pagination from '@shared/components/ui/Pagination';

const MembersOnlyListSection = () => {
  const { query, pages } = useProduct<MembersOnlyResult>(
    getMembersOnlyList,
    '',
  );
  const { isLoading, error, data } = query;
  const cards: MembersOnly[] = data?.membersOnly ?? [];

  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16 color-grey-border-top flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        {isLoading && <LoadingSpinner />}
        {error && (
          <Text className="mb-60 mt-40">Error cargando resultados</Text>
        )}
        {data && cards.length === 0 && (
          <Text className="mb-20">No hay contenido disponible...</Text>
        )}

        {!isLoading && !error && data && (
          <List<MembersOnly>
            cards={cards}
            component={(card) => <MembersOnlyCard card={card} key={card._id} />}
          />
        )}

        {data && cards.length > 0 && (
          <Pagination pages={pages} variant="purple" />
        )}
      </div>
    </section>
  );
};

export default MembersOnlyListSection;
