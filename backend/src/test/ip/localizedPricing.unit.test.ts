import { getLocalizedPricing } from '@/use-cases/ip/getLocalizedPricing.usecase';
import type { IExchangeRateRepository } from '@domain/ports/ILocationRepository';

describe('getLocalizedPricing unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockItems = [
    { name: 'Básico', price: 23 },
    { name: 'Estándar', price: 49 },
    { name: 'Premium', price: 93 },
  ];

  const mockRepository: IExchangeRateRepository = {
    getRate: jest.fn(),
  };

  /**
   * SUCCESS CASE
   * Verifies prices are correctly converted using the exchange rate.
   */
  test('converts prices using exchange rate', async () => {
    (mockRepository.getRate as jest.Mock).mockResolvedValue({
      currencyCode: 'MXN',
      rate: 17.5,
    });

    const result = await getLocalizedPricing('MXN', mockItems, mockRepository);

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      name: 'Básico',
      originalPrice: 23,
      localizedPrice: Math.round(23 * 17.5 * 100) / 100,
      currencyCode: 'MXN',
      exchangeRate: 17.5,
    });
  });

  /**
   * FALLBACK TO USD
   * Verifies that when exchange rate is unavailable, rate defaults to 1.
   */
  test('falls back to USD when exchange rate is null', async () => {
    (mockRepository.getRate as jest.Mock).mockResolvedValue(null);

    const result = await getLocalizedPricing('XYZ', mockItems, mockRepository);

    expect(result[0].currencyCode).toBe('USD');
    expect(result[0].exchangeRate).toBe(1);
    expect(result[0].localizedPrice).toBe(23);
  });

  /**
   * EMPTY ITEMS
   * Verifies that an empty array returns an empty array.
   */
  test('returns empty array when items is empty', async () => {
    (mockRepository.getRate as jest.Mock).mockResolvedValue({
      currencyCode: 'MXN',
      rate: 17.5,
    });

    const result = await getLocalizedPricing('MXN', [], mockRepository);

    expect(result).toEqual([]);
  });

  /**
   * ERROR HANDLING
   * Verifies that errors from the exchange rate repository are propagated.
   */
  test('throws error when repository fails', async () => {
    (mockRepository.getRate as jest.Mock).mockRejectedValue(
      new Error('API error'),
    );

    await expect(
      getLocalizedPricing('MXN', mockItems, mockRepository),
    ).rejects.toThrow('API error');
  });
});
