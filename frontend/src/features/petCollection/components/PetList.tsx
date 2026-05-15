import type { PetInfo } from '../types/petCollection.types';
import PetCard from './PetCard';

export interface Props {
  pets: PetInfo[];
}

const PetList = ({ pets }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 md:gap-4 gap-2 mt-4 md:h-10/12">
      {pets.map((pet, idx) => {
        return <PetCard petInfo={pet} key={idx} />;
      })}
    </div>
  );
};

export default PetList;
