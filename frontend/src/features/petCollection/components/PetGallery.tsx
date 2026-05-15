import Pagination from '@/shared/components/ui/Pagination';
import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import PetList from './PetList';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import { Text } from '@/shared/components/ui/Text';
import type { PetCollectionQuery } from '../types/petCollection.types';
import { HiOutlineFilter } from 'react-icons/hi';
import PetDropDown from './PetDropDown';
import useClickOutside from '@/shared/hooks/useClickOutside';

interface Props {
  pages: {
    pageHook: [number, Dispatch<SetStateAction<number>>];
    visiblePages: number[];
    totalPages: number;
  };
  vectorImages: PetCollectionQuery;
  img: File | null;
}

interface PetGalleryProps extends Props {
  handleSearch: (k: string, v: string) => void;
}

const PetGallery = ({
  handleSearch,
  pages,
  vectorImages,
  img,
}: PetGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Ref for the dropdown menu to handle outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, setIsOpen);

  return (
    <div className="p-2 md:w-2/3 md:h-screen bg-purple-secondary">
      <div className="relative flex justify-end w-full pl-2">
        <div ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            name={'petDropdown'}
            className="bg-white rounded-lg h-10 flex flex-row justify-center items-center cursor-pointer gap-1 px-2 hover:bg-purple-secondary text-dark-purple border-[1px] border-dark-purple hover:border-purple-primary group mr-7 md:mr-10"
          >
            <HiOutlineFilter
              // color="black"
              size="80%"
              className="h-5"
            />
            <Text className="text-dark-purple">Filtro</Text>
          </button>
          <PetDropDown isOpen={isOpen} handleSearch={handleSearch} />
        </div>
      </div>
      {vectorImages.isLoading && <LoadingSpinner />}
      {vectorImages.error && (
        <Text color="text-red-600" className="text-center">
          Error cargando imágenes
        </Text>
      )}

      {!vectorImages.isLoading && !vectorImages.error && (
        <GalleryContent vectorImages={vectorImages} pages={pages} img={img} />
      )}
    </div>
  );
};

const GalleryContent = ({ vectorImages, pages, img }: Props) => {
  return (
    <>
      {vectorImages.data && vectorImages.data.length > 0 ? (
        <>
          <PetList pets={vectorImages.data} />
          <div className="w-full flex justify-center">
            {pages.totalPages > 0 && (
              <Pagination pages={pages} color="bg-purple-primary" />
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center md:-mt-10 min-h-96 md:h-full">
          <Text
            variant="h2"
            color="text-grey-500"
            className="max-md:text-center"
          >
            {img
              ? 'No se encontraron resultados'
              : 'Sube una imagen primero para poder buscar a tu mascota'}
          </Text>
        </div>
      )}
    </>
  );
};

export default PetGallery;
