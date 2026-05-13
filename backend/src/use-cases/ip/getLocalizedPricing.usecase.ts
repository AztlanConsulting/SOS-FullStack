import type { IExchangeRateRepository } from '@domain/ports/ILocationRepository';

/**
 * Minimal interface for any priceable item.
 * Plans, manuals, talleres — anything with a name and a USD price.
 */
export interface PriceableItem {
  name: string;
  price: number;
}

/**
 * Represents the price converted to the user's local currency.
 */
export interface localizedItem {
  name: string;
  originalPrice: number;
  localizedPrice: number;
  currencyCode: string;
  exchangeRate: number;
}

/**
 * Use case to retrieve plans with prices converted to the user's local currency.
 * Falls back to USD if the exchange rate cannot be resolved.
 * @param currencyCode ISO 4217 currency code detected from the user's IP
 * @param planRepository Implementation of PlanRepository
 * @param exchangeRateRepository Implementation of IExchangeRateRepository
 * @returns A promise resolving to an array of localizedItem objects.
 */
export const getLocalizedPricing = async (
  currencyCode: string,
  items: PriceableItem[],
  exchangeRateRepository: IExchangeRateRepository,
): Promise<localizedItem[]> => {
  const exchangeRate = await exchangeRateRepository.getRate(currencyCode);

  // Fall back to USD if exchange rate is unavailable
  const rate = exchangeRate?.rate ?? 1;
  const resolvedCurrency = exchangeRate?.currencyCode ?? 'USD';

  return items.map((item) => ({
    name: item.name,
    originalPrice: item.price,
    localizedPrice: Math.round(item.price * rate * 100) / 100,
    currencyCode: resolvedCurrency,
    exchangeRate: rate,
  }));
};
