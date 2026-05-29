import { Text } from '@shared/components/ui/Text';
import type React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

interface Props {
  variant?: 'primary' | 'purple';
  pages: {
    visiblePages: number[];
    totalPages: number;
    pageHook: [
      page: number,
      setPage: React.Dispatch<React.SetStateAction<number>>,
    ];
  };
  color?: string;
}

const Pagination = ({
  pages,
  color = 'bg-primary',
  variant = 'primary',
}: Props) => {
  const page = pages.pageHook[0];
  const setPage = pages.pageHook[1];
  const totalPages = pages.totalPages;
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeColor =
    variant === 'purple'
      ? 'bg-purple-primary text-white'
      : `${color} text-black`;

  return (
    <div className="flex justify-center items-center gap-2 mt-6 pb-8">
      <button
        type="button"
        onClick={() => goToPage(Math.max(page - 1, 1))}
        aria-disabled={isFirstPage}
        className={`h-8 aspect-square mr-3 color-grey-bg text-black border rounded cursor-pointer ${
          isFirstPage ? 'opacity-50' : ''
        }`}
      >
        <HiChevronLeft size="100%" className="h-5" />
      </button>

      {pages.visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`h-8 aspect-square border rounded cursor-pointer ${
            page === p ? activeColor : 'bg-white text-black'
          }`}
        >
          <Text as="p" variant="body" weight="regular" color="text-black">
            {p}
          </Text>
        </button>
      ))}

      <button
        type="button"
        onClick={() => goToPage(Math.min(page + 1, totalPages))}
        aria-disabled={isLastPage}
        className={`h-8 aspect-square ml-3 color-grey-bg text-black border rounded cursor-pointer ${
          isLastPage ? 'opacity-50' : ''
        }`}
      >
        <HiChevronRight size="100%" className="h-5" />
      </button>
    </div>
  );
};

export default Pagination;
