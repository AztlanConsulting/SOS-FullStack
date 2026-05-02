import Pagination from '@/shared/components/ui/Pagination';
import SearchInput from '@/shared/components/ui/SearchInput';
import type { Dispatch, SetStateAction } from 'react';
import PetList from './PetList';

interface Props {
  handleSearch: (s: string) => void;
  pages: {
    pageHook: [number, Dispatch<SetStateAction<number>>];
    visiblePages: number[];
    totalPages: number;
  };
}

const PetGallery = ({ handleSearch, pages }: Props) => {
  return (
    <div className="p-2 md:w-2/3 md:h-screen">
      <div className="md:w-1/3 md:ml-auto">
        <SearchInput handleSearch={handleSearch} />
      </div>
      <PetList />
      <div className="w-full flex justify-center">
        {pages.totalPages > 0 && <Pagination pages={pages} />}
      </div>
    </div>
  );
};

export default PetGallery;
