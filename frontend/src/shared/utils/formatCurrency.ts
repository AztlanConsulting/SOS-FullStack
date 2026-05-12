/**
 * Formats a numeric price into a localized currency string.
 * Uses the browser's native Intl.NumberFormat for correct symbols,
 * decimal rules, and positioning per currency/locale.
 * @param amount - The numeric price to format.
 * @param currencyCode - ISO 4217 currency code (e.g. "MXN", "USD", "EUR").
 * @returns A formatted string e.g. "MX$390", "€320", "$25"
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string,
): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount % 1 === 0 ? amount : amount.toFixed(2)}`;
  }
};
