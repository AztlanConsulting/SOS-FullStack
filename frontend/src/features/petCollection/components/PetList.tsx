import PetCard from './PetCard';

const PetList = () => {
  const arr = new Array(10).fill(0);
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 md:gap-4 gap-2 mt-4 h-10/12">
      {arr.map((a) => (
        <PetCard />
      ))}
    </div>
  );
};

export default PetList;
