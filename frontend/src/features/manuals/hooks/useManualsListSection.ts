import { useEffect, useState } from 'react';
import { getManuals } from '../services/manual.service';
import type { Manual } from '../types/Manual.type';

export const useManualsListSection = () => {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('Nombre (A-Z)');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch manuals when the component mounts
  useEffect(() => {
    const fetchManuals = async () => {
      try {
        const data = await getManuals();
        setManuals(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchManuals();
  }, []);

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  // Filter and sort manuals based on search term and selected sort option
  const filteredManuals = manuals
    .filter((manual) =>
      manual.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'Nombre (A-Z)':
          return a.name.localeCompare(b.name);
        case 'Nombre (Z-A)':
          return b.name.localeCompare(a.name);
        case 'Precio: menor a mayor':
          return a.price - b.price;
        case 'Precio: mayor a menor':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  // Calculate the index of the last item for the current page
  const indexOfLastItem = currentPage * itemsPerPage;

  // Calculate the index of the first item for the current page
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get the manuals to be displayed on the current page
  const currentManuals = filteredManuals.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Calculate the total number of pages based on the filtered manuals
  const totalPages = Math.ceil(filteredManuals.length / itemsPerPage);

  // Calculate the visible pages for pagination
  const maxVisiblePages = 5;

  // Calculate the start page for pagination
  let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);

  // Calculate the end page for pagination
  let endPage = startPage + maxVisiblePages - 1;

  // Adjust the end page if it exceeds the total number of pages
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  // Create an array of visible pages for pagination
  const visiblePages = [];

  // Populate the visible pages array based on the calculated start and end pages
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return {
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
  };
};
