/**
 * Represents a product or service with its price converted to a specific currency.
 *
 * This interface is typically used after a conversion service calculates the
 * "localizedPrice" by multiplying the "originalPrice" (base currency, usually USD)
 * by the current "exchangeRate".
 */
export interface LocalizedItem {
  name: string;
  originalPrice: number;
  localizedPrice: number;
  currencyCode: string;
  exchangeRate: number;
}
