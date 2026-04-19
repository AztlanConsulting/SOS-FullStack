import { Text } from '@shared/components/ui/Text';
import type React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

interface Props {
  pages: {
    visiblePages: number[];
    totalPages: number;
    pageHook: [
      page: number,
      setPage: React.Dispatch<React.SetStateAction<number>>,
    ];
  };
}

const Pagination = ({ pages }: Props) => {
  const page = pages.pageHook[0];
  const setPage = pages.pageHook[1];
  const totalPages = pages.totalPages;

  return (
    <div className="flex justify-center items-center gap-2 mt-6 pb-8">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className="h-8 aspect-square mr-3 color-grey-bg text-black border rounded disabled:opacity-50 enabled:cursor-pointer"
      >
        <HiChevronLeft size="100%" className="h-5" />
      </button>

      {pages.visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`h-8 aspect-square border rounded cursor-pointer ${
            page === p ? 'color-primary-bg text-black' : 'bg-white text-black'
          }`}
        >
          <Text as="p" variant="body" weight="regular" color="text-black">
            {p}
          </Text>
        </button>
      ))}

      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages}
        className="h-8 aspect-square ml-3 color-grey-bg text-black border rounded disabled:opacity-50 enabled:cursor-pointer"
      >
        <HiChevronRight size="100%" className="h-5" />
      </button>
    </div>
  );
};

export default Pagination;
