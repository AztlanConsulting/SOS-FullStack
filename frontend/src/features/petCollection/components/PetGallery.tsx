import Pagination from '@/shared/components/ui/Pagination';
import SearchInput from '@/shared/components/ui/SearchInput';
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import PetList from './PetList';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import { Text } from '@/shared/components/ui/Text';
import type { PetCollectionQuery } from '../types/petCollection.types';

interface Props {
  pages: {
    pageHook: [number, Dispatch<SetStateAction<number>>];
    visiblePages: number[];
    totalPages: number;
  };
  vectorImages: PetCollectionQuery;
}

interface PetGalleryProps extends Props {
  handleSearch: (s: string) => void;
}

const PetGallery = ({ handleSearch, pages, vectorImages }: PetGalleryProps) => {
  return (
    <div className="p-2 md:w-2/3 h-screen">
      <div className="md:w-1/3 md:ml-auto">
        <SearchInput handleSearch={handleSearch} />
      </div>

      {vectorImages.isLoading && <LoadingSpinner />}
      {vectorImages.error && (
        <Text color="text-red-600" className="text-center">
          Error cargando imágenes
        </Text>
      )}

      {!vectorImages.isLoading && !vectorImages.error && (
        <GalleryContent vectorImages={vectorImages} pages={pages} />
      )}
    </div>
  );
};

const GalleryContent = ({ vectorImages, pages }: Props) => {
  return (
    <>
      {vectorImages.data && vectorImages.data.length > 0 ? (
        <>
          <PetList pets={vectorImages.data} />
          <div className="w-full flex justify-center">
            {pages.totalPages > 0 && <Pagination pages={pages} />}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center mt-5 md:mt-0 md:h-1/2">
          <Text
            variant="h2"
            color="text-grey-500"
            className="max-md:text-center"
          >
            Sube una imagen primero para poder buscar a tu mascota
          </Text>
        </div>
      )}
    </>
  );
};

export default PetGallery;
