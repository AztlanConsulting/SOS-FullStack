import { describe, test, expect } from 'vitest';
import { getTier, calculatePrice } from '@features/plans/components/customPlan';

/**
 * Unit tests for customPlan utility functions.
 * Validates getTier and calculatePrice logic.
 */
describe('customPlan utilities', () => {
  describe('getTier', () => {
    test('returns tier 1-4 for days=1', () => {
      expect(getTier(1).minDays).toBe(1);
      expect(getTier(1).maxDays).toBe(4);
    });

    test('returns tier 1-4 for days=3', () => {
      expect(getTier(3).minDays).toBe(1);
      expect(getTier(3).maxDays).toBe(4);
    });

    test('returns tier 5-6 for days=5', () => {
      expect(getTier(5).minDays).toBe(5);
      expect(getTier(5).maxDays).toBe(6);
    });

    test('returns tier 7-14 for days=7', () => {
      expect(getTier(7).minDays).toBe(7);
      expect(getTier(7).maxDays).toBe(14);
    });

    test('returns tier 15-30 for days=15', () => {
      expect(getTier(15).minDays).toBe(15);
      expect(getTier(15).maxDays).toBe(30);
    });

    test('returns tier 15-30 for days=30', () => {
      expect(getTier(30).minDays).toBe(15);
      expect(getTier(30).maxDays).toBe(30);
    });
  });

  describe('calculatePrice', () => {
    test('calculates base price correctly for tier 1', () => {
      // 3 * 80 + 5 * 15 = 315
      expect(calculatePrice(3, 5, [])).toBe(315);
    });

    test('calculates base price correctly for tier 2', () => {
      // 5 * 75 + 5 * 12.5 = 437.5
      expect(calculatePrice(5, 5, [])).toBe(437.5);
    });

    test('calculates base price correctly for tier 3', () => {
      // 7 * 72 + 5 * 11.2 = 560
      expect(calculatePrice(7, 5, [])).toBe(560);
    });

    test('calculates base price correctly for tier 4', () => {
      // 15 * 72 + 5 * 13 = 1145
      expect(calculatePrice(15, 5, [])).toBe(1145);
    });

    test('adds feature price correctly', () => {
      // 3 * 80 + 5 * 15 + 50 asesor = 365
      expect(calculatePrice(3, 5, ['asesor'])).toBe(365);
    });

    test('adds multiple feature prices correctly', () => {
      // 3 * 80 + 5 * 15 + 50 asesor + 50 geo_dinamica = 415
      expect(calculatePrice(3, 5, ['asesor', 'geo_dinamica'])).toBe(415);
    });

    test('ignores features not in current tier', () => {
      // days=7 tier only has geo_doble and reel, asesor should be ignored
      // 7 * 72 + 5 * 11.2 + 0 = 560
      expect(calculatePrice(7, 5, ['asesor'])).toBe(560);
    });
  });
});
