import type { PetInfo } from '../types/petCollection.types';
import PetCard from './PetCard';

export interface Props {
  pets: PetInfo[];
}

const PetList = ({ pets }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-y-5 w-5/6 md:w-11/12 mx-auto mt-4 md:h-10/12 ">
      {pets.map((pet, idx) => {
        return <PetCard petInfo={pet} key={idx} />;
      })}
    </div>
  );
};

export default PetList;
