import { describe, test, expect } from 'vitest';
import { calculateStackedExpiry } from '@/shared/utils/planDates';

describe('calculateStackedExpiry (Unit Tests)', () => {
  /**
   * Verifies single plan returns correct expiry date
   */
  test('single plan returns createdAt + duration', () => {
    const plans = [{ createdAt: '2026-05-01T00:00:00Z', duration: 30 }];
    const result = calculateStackedExpiry(plans);

    const expected =
      new Date('2026-05-01T00:00:00Z').getTime() + 30 * 24 * 60 * 60 * 1000;
    expect(result[0].getTime()).toBe(expected);
  });

  /**
   * Verifies two plans stack correctly when previous plan is still active
   */
  test('two plans stack when previous is still active', () => {
    const now = new Date();
    const yesterday = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const twoDaysAgo = new Date(
      now.getTime() - 2 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const plans = [
      { createdAt: yesterday, duration: 5 }, // newest - 5 days
      { createdAt: twoDaysAgo, duration: 10 }, // older - 10 days, still active
    ];

    const result = calculateStackedExpiry(plans);
    // newest should stack on top of older plan's remaining days
    expect(result[0].getTime()).toBeGreaterThan(now.getTime());
  });

  /**
   * Verifies newest plan starts fresh when previous plan has expired
   */
  test('newest plan starts fresh when previous has expired', () => {
    const plans = [
      { createdAt: '2026-05-20T00:00:00Z', duration: 15 }, // newest
      { createdAt: '2026-01-01T00:00:00Z', duration: 1 }, // expired long ago
    ];

    const result = calculateStackedExpiry(plans);
    const expected =
      new Date('2026-05-20T00:00:00Z').getTime() + 15 * 24 * 60 * 60 * 1000;
    expect(result[0].getTime()).toBe(expected);
  });

  /**
   * Verifies plans are sorted by createdAt descending
   */
  test('plans are sorted newest first', () => {
    const plans = [
      { createdAt: '2026-01-01T00:00:00Z', duration: 30 }, // older
      { createdAt: '2026-05-01T00:00:00Z', duration: 15 }, // newer
    ];

    const result = calculateStackedExpiry(plans);
    const newerExpiry =
      new Date('2026-05-01T00:00:00Z').getTime() + 15 * 24 * 60 * 60 * 1000;
    // first result should be for the newer plan
    expect(result[0].getTime()).toBeGreaterThanOrEqual(newerExpiry);
  });

  /**
   * Verifies empty plans returns empty array
   */
  test('returns empty array for empty plans', () => {
    const result = calculateStackedExpiry([]);
    expect(result).toHaveLength(0);
  });
});
