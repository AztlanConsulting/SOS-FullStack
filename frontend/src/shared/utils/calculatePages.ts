function calculatePages(
  totalElements: number,
  maxElementsInPage: number,
): [number[], number] {
  const visiblePages = new Array(Math.ceil(totalElements / maxElementsInPage))
    .fill(0)
    .map((_, idx) => idx + 1);
  const totalPages = Math.ceil(totalElements / maxElementsInPage);

  return [visiblePages, totalPages];
}

export default calculatePages;
