import type React from 'react';

interface Props<T> {
  cards: T[];
  component: (card: T, idx: number) => React.ReactNode;
}

/**
 * List component to render a list of elements
 * @type T: type of the array of cards and information the component takes
 * @param cards: data that needs to be rendered
 * @param component: component that needs to be rendered
 * @returns Container with rendered cards
 */
const List = <T,>({ cards, component }: Props<T>) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-8">
      {cards.map((c, idx) => component(c, idx))}
    </div>
  );
};

export default List;
