export function formatDateEsShort(dateValue: string | Date): string {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha no disponible';
  }

  const parts = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).formatToParts(date);

  const day = parts.find((p) => p.type === 'day')?.value ?? '';
  const month =
    parts
      .find((p) => p.type === 'month')
      ?.value.replace('.', '')
      .toLowerCase() ?? '';
  const year = parts.find((p) => p.type === 'year')?.value ?? '';

  return `${day} ${month} ${year}`.trim();
}
