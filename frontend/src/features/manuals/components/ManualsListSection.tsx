import { HiOutlineSearch } from 'react-icons/hi';
import { HiArrowsUpDown } from 'react-icons/hi2';
import { HiChevronLeft } from 'react-icons/hi2';
import { HiChevronRight } from 'react-icons/hi2';
import { useManualsListSection } from '../hooks/useManualsListSection';
import { ManualItem } from './ManualItem';
import type { Manual } from '../types/Manual.type';
import { Text } from '@shared/components/ui/Text/Text';
import { useEffect, useRef } from 'react';

export const ManualsListSection = () => {
  const {
    manuals,
    loading,
    error,
    searchTerm,
    handleSearchChange,
    isOpen,
    setIsOpen,
    sortOption,
    setSortOption,
    filteredManuals,
    currentPage,
    setCurrentPage,
    currentManuals,
    totalPages,
    visiblePages,
  } = useManualsListSection();

  // Ref for the dropdown menu to handle outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset the current page when the search term or sort option changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption, setCurrentPage]);

  // Close the dropdown when clicking outside of it
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

  if (loading) {
    return (
      <section className="bg-secondary w-full p-10 text-center text-black">
        <Text as="p" variant="body" weight="regular" color="text-black">
          Cargando manuales...
        </Text>
      </section>
    );
  }

  if (error) {
    console.error(error);
    return (
      <section className="bg-secondary w-full p-10 text-center text-black">
        <Text as="p" variant="body" weight="regular" color="text-black">
          Error al cargar los manuales.
        </Text>
      </section>
    );
  }

  if (manuals.length === 0) {
    return (
      <section className="bg-secondary w-full p-10 text-center text-black">
        <Text as="p" variant="body" weight="regular" color="text-black">
          No se encontraron manuales.
        </Text>
      </section>
    );
  }

  return (
    <section className="bg-secondary w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        <div className="flex flex-row justify-center items-center gap-2 my-8 w-full md:w-1/2 lg:w-2/5 md:place-self-end">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="bg-white rounded-lg h-10 aspect-square flex flex-row justify-center items-center color-grey-border"
            >
              <HiArrowsUpDown color="black" size="100%" className="h-6" />
            </button>
            {isOpen && (
              <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-md w-56 z-50">
                {[
                  'Nombre (A-Z)',
                  'Nombre (Z-A)',
                  'Precio: menor a mayor',
                  'Precio: mayor a menor',
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 py-1 cursor-pointer hover:bg-(--color-grey-bg) py-2.5 px-3"
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={sortOption === option}
                      onChange={() => {
                        setSortOption(option);
                      }}
                    />
                    <Text
                      as="caption"
                      variant="caption"
                      weight="regular"
                      color="text-black"
                    >
                      {option}
                    </Text>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg w-full h-10 flex flex-row justify-between items-center pl-3 color-grey-border">
            <input
              type="search"
              id="manuals-search"
              name="manuals-search"
              placeholder="Buscar..."
              onChange={(event) => handleSearchChange(event.target.value)}
              className="bg-transparent outline-none text-black placeholder-gray-500 w-full h-full"
            />
            <button
              type="submit"
              className="flex flex-row justify-end items-center h-full aspect-square"
            >
              <HiOutlineSearch
                color="black"
                size="100%"
                className="h-6 flex flex-row justify-end"
              />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-8">
          {filteredManuals.length === 0 ? (
            <Text
              as="p"
              variant="body"
              weight="regular"
              color="text-black"
              className="col-span-full pt-20 pb-20 text-center text-black"
            >
              No se encontraron manuales.
            </Text>
          ) : (
            currentManuals.map((manual: Manual) => (
              <ManualItem key={manual._id} manual={manual} />
            ))
          )}
        </div>
        <div className="flex justify-center items-center gap-2 mt-6 pb-8">
          {filteredManuals.length === 0 ? null : (
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 aspect-square mr-3 color-grey-bg text-black border rounded disabled:opacity-50"
            >
              <HiChevronLeft size="100%" className="h-5" />
            </button>
          )}

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-8 aspect-square border rounded ${
                currentPage === page
                  ? 'color-primary-bg text-black'
                  : 'bg-white text-black'
              }`}
            >
              <Text as="p" variant="body" weight="regular" color="text-black">
                {page}
              </Text>
            </button>
          ))}

          {filteredManuals.length === 0 ? null : (
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="h-8 aspect-square ml-3 color-grey-bg text-black border rounded disabled:opacity-50"
            >
              <HiChevronRight size="100%" className="h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
