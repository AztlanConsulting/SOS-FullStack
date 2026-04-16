function calculatePages(
  totalElements: number,
  currentPage: number,
  maxElementsInPage: number,
): [number[], number] {
  const maxVisiblePages = 5;

  let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  let endPage = startPage + maxVisiblePages - 1;

  const totalPages = Math.ceil(totalElements / maxElementsInPage);

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  const visiblePages = new Array(endPage - startPage + 1)
    .fill(0)
    .map((_, idx) => idx + startPage);

  console.log(visiblePages);

  return [visiblePages, totalPages];
}

export default calculatePages;
