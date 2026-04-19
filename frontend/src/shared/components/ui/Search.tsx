import { HiArrowsUpDown } from 'react-icons/hi2';
import DropDown from './DropDown';
import SearchInput from './SearchInput';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  searchHook: {
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    sortHook: [
      sortOption: string,
      setSortOption: React.Dispatch<React.SetStateAction<string>>,
    ];
  };
}

const Search = ({ searchHook }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  // Ref for the dropdown menu to handle outside clicks
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

    // Add event listener for clicks outside the dropdown
    document.addEventListener('pointerdown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div className="flex flex-row justify-center items-center gap-2 my-8 w-full md:w-1/2 lg:w-2/5 md:place-self-end">
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-white rounded-lg h-10 aspect-square flex flex-row justify-center items-center color-grey-border cursor-pointer"
        >
          <HiArrowsUpDown color="black" size="100%" className="h-6" />
        </button>
        <DropDown isOpen={isOpen} sortHook={searchHook.sortHook} />
      </div>
      <SearchInput setSearchTerm={searchHook.setSearchTerm} />
    </div>
  );
};

export default Search;
