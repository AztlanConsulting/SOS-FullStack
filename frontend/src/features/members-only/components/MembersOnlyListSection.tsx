import { useQuery } from '@tanstack/react-query';
import List from '@shared/components/ui/List';
import MembersOnlyCard from './MembersOnlyCard';
import type { MembersOnly } from '../types/membersOnly.types';
import { getMembersOnlyList } from '../services/membersOnly.service';

const MembersOnlyListSection = () => {
  const { data } = useQuery({
    queryKey: ['membersOnly', 'list'],
    queryFn: () => getMembersOnlyList(0),
  });

  const cards: MembersOnly[] = data?.membersOnly ?? [];

  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16 color-grey-border-top flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        <List<MembersOnly>
          cards={cards}
          component={(card) => <MembersOnlyCard card={card} key={card._id} />}
        />
      </div>
    </section>
  );
};

export default MembersOnlyListSection;
