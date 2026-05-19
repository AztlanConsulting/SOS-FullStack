import SearchPets from '@/features/petCollection/components/SearchPetsPage';
import { Outlet } from 'react-router';

const PetCollectionPage = () => {
  return (
    <div>
      <SearchPets />
      <Outlet />
    </div>
  );
};

export default PetCollectionPage;
