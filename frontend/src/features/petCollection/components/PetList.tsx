import type { PetInfo } from '../types/petCollection.types';
import PetCard from './PetCard';

export interface Props {
  pets: PetInfo[];
}

const PetList = ({ pets }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 md:gap-4 gap-2 mt-4 h-10/12">
      {pets.map((pet, idx) => {
        console.log(pet);
        return <PetCard img={pet.image} key={idx} />;
      })}
    </div>
  );
};

export default PetList;
