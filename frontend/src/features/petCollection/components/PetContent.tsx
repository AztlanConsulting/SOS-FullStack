import type { PetInfoDetailed } from '../types/petCollection.types';

interface Props {
  petInfo: PetInfoDetailed;
}

const PetContent = ({ petInfo }: Props) => {
  return <div className="w-full h-full bg-primary" />;
};

export default PetContent;
