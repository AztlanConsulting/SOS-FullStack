import { HiOutlineFunnel } from 'react-icons/hi2';
import { useEffect, useRef, useState } from 'react';
import SearchInput from '@shared/components/ui/SearchInput';
import DropDown from '@shared/components/ui/DropDownResource';

interface Props {
  searchHook: {
    handleSearch: (s: string) => void;
    sortHook: [
      sortOption: string,
      setSortOption: React.Dispatch<React.SetStateAction<string>>,
    ];
    typeHook: [
      typeOption: string,
      setTypeOption: React.Dispatch<React.SetStateAction<string>>,
    ];
  };
}

const ResourceSearch = ({ searchHook }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-row justify-center items-center gap-2 my-4 w-full md:w-1/2 lg:w-2/5 md:ml-auto">
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-white rounded-lg h-10 aspect-square flex flex-row justify-center items-center color-grey-border cursor-pointer"
        >
          <HiOutlineFunnel color="black" size="100%" className="h-6" />
        </button>
        <DropDown
          isOpen={isOpen}
          sortHook={searchHook.sortHook}
          typeHook={searchHook.typeHook}
        />
      </div>
      <SearchInput handleSearch={searchHook.handleSearch} />
    </div>
  );
};

export default ResourceSearch;
