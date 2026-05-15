import type {
  IExchangeRateRepository,
  ExchangeRate,
} from '@/domain/ports/ILocationRepository';
import axios from 'axios';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  rate: number;
  fetchedAt: number;
}

/**
 * In-memory store for currency rates.
 * Structure: { 'MXN': { rate: 17.5, fetchedAt: 1715454000000 } }
 */
const rateCache: Record<string, CacheEntry> = {};

/**
 *
 * Fetches real-time currency conversion rates relative to USD.
 *
 * Features:
 * - Local Memory Caching: Minimizes external latency and API usage.
 * - Error Resilience: Returns null on network or data errors to allow
 *   the domain layer to handle fallbacks (e.g., using a default rate).
 */
export const ExchangeRateApiService: IExchangeRateRepository = {
  /**
   * Retrieves the exchange rate for a specific currency code against USD.
   *
   * @param currencyCode - The ISO 4217 code (e.g., "MXN", "EUR").
   * @returns A promise resolving to the ExchangeRate object or null if unavailable.
   */
  async getRate(currencyCode: string): Promise<ExchangeRate | null> {
    try {
      const cached = rateCache[currencyCode];
      const now = Date.now();

      // Check if a valid (non-expired) rate exists in memory
      if (cached !== undefined && now - cached.fetchedAt < CACHE_TTL_MS) {
        return { currencyCode, rate: cached.rate };
      }
      // Fetch latest rates from Open Exchange Rates API (Free Tier endpoint)
      const response = await axios.get(`https://open.er-api.com/v6/latest/USD`);

      if (response.data.result !== 'success') {
        console.error('Exchange rate API error:', response.data);
        return null;
      }

      const rate = response.data.rates[currencyCode];

      if (rate === undefined) {
        console.error('Currency code not found in API response:', currencyCode);
        return null;
      }

      // Update local cache
      rateCache[currencyCode] = { rate, fetchedAt: now };

      return { currencyCode, rate };
    } catch (error) {
      // Log error but don't crash; let the caller decide how to proceed
      console.error('Error fetching exchange rate:', error);
      return null;
    }
  },
};
