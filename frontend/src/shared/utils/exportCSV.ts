/**
 * Utility function to export an array of objects to a downloadable CSV file.
 *
 * @param filename - The desired name for the generated file (without extension).
 * @param rows - An array of objects where keys represent headers and values represent cell data.
 */
export const exportToCSV = (
  filename: string,
  rows: Record<string, unknown>[],
) => {
  if (!rows.length) return;

  // Exit early if there is no data to export
  const headers = Object.keys(rows[0]);

  /**
   * Construct the CSV string:
   * 1. Join headers with commas.
   * 2. Map over each row object.
   * 3. For each cell, ensure it's a string and wrap it in double quotes.
   * 4. Escape existing double quotes by doubling them (RFC 4180 standard).
   */
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`)
        .join(','),
    ),
  ].join('\n');
  // Create a Blob containing the CSV data with UTF-8 encoding
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  // Create a temporary URL pointing to the Blob
  const url = URL.createObjectURL(blob);
  // Create a hidden "a" element to trigger the download programmatically
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  // Clean up the memory by revoking the object URL
  URL.revokeObjectURL(url);
};
