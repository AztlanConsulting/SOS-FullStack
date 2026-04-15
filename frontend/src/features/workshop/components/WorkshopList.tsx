import WorkshopCard from './WorkshopCard';

interface Props {
  cards: [];
}

const WorkshopList = ({ cards }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-8">
      {cards.map((c, idx) => (
        <WorkshopCard key={idx} workshop={c} />
      ))}
    </div>
  );
};

export default WorkshopList;
