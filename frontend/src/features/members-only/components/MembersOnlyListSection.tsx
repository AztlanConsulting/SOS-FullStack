import List from '@shared/components/ui/List';
import MembersOnlyCard from './MembersOnlyCard';
import type { MembersOnly } from '../types/membersOnly.types';

export const membersOnlyCards: MembersOnly[] = [
  {
    _id: 'mimi',
    name: 'Mimi',
    duration: 5,
    content: 'Contenido de Mimi...',
    imageUrl: '/images/dog2.png',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    _id: 'mimi',
    name: 'Mimi',
    duration: 5,
    content: 'Contenido de Mimi...',
    imageUrl: '/images/dog2.png',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    _id: 'mimi',
    name: 'Mimi',
    duration: 5,
    content: 'Contenido de Mimi...',
    imageUrl: '/images/dog2.png',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    _id: 'mimi',
    name: 'Mimi',
    duration: 5,
    content: 'Contenido de Mimi...',
    imageUrl: '/images/dog2.png',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

const MembersOnlyListSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16 color-grey-border-top flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        <List<MembersOnly>
          cards={membersOnlyCards}
          component={(card) => <MembersOnlyCard card={card} key={card._id} />}
        />
      </div>
    </section>
  );
};

export default MembersOnlyListSection;
