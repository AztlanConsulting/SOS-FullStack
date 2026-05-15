import { getLocalizedPricing } from '@/use-cases/ip/getLocalizedPricing.usecase';
import { GetLocationByIp } from '@/use-cases/ip/GetLocationByIp';
import { getPlansDB } from '@/use-cases/plans/getPlansDB.usecase';
import { ExchangeRateApiService } from '@/infrastructure/api/exhangeRate.api';
import { PlanDataAccess } from '@/infrastructure/data-access/plan.data-access';
import { IpApiService } from '@/infrastructure/api/IpApiService';
import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';
import { WorkshopDataAccess } from '@/infrastructure/data-access/workshop.data-access';
import type { Request, Response } from 'express';

/**
 *
 * Orchestrates the delivery of localized content and pricing based on the user's IP address.
 * It detects the user's location, determines the appropriate currency, and converts
 * prices for plans, manuals, and workshops in parallel.
 */
export const PricingController = {
  /**
   *
   * Logic Flow:
   * 1. Detect IP: Handles IPv6 to IPv4 conversion and provides a fallback for localhost.
   * 2. Geo-Location: Uses an external API to find the user's country and currency.
   * 3. Concurrent Data Fetch: Retrieves raw items from the database.
   * 4. Concurrent Localization: Converts prices based on the retrieved currency code.
   */
  async handle(req: Request, res: Response) {
    // Standardize IP address
    const ipV6 = req.socket.remoteAddress ?? '8.8.8.8';
    const ip = ipV6.replace('::ffff:', '');
    // Ensure we don't query local interface addresses (uses Google DNS IP as fallback)
    // const safeIp = ip === '127.0.0.1' || ip === '::1' ? '8.8.8.8' : ip;
    // const safeIp = '187.190.0.1';
    const safeIp = '61.74.0.1';
    // const safeIp = '181.129.54.12';
    // const safeIp = '146.70.231.210';

    // 1. Identify User Location & Currency
    const location = await GetLocationByIp(safeIp, IpApiService);
    const currencyCode = location?.currency ?? 'USD';
    // 2. Fetch all products from internal data access layers
    const planRepository = getPlansDB(PlanDataAccess);
    const [plans, manuals, workshops] = await Promise.all([
      planRepository.getPlans(),
      ManualDataAccess.getManuals({ page: 0, searchTerm: '' }),
      WorkshopDataAccess.getWorkshops({ page: 0, searchTerm: '' }),
    ]);

    // 3. Transform prices based on the detected currency
    const [localizedPlans, localizedManuals, localizedWorkshops] =
      await Promise.all([
        getLocalizedPricing(currencyCode, plans, ExchangeRateApiService),
        getLocalizedPricing(currencyCode, manuals, ExchangeRateApiService),
        getLocalizedPricing(currencyCode, workshops, ExchangeRateApiService),
      ]);

    // 4. Return aggregated response
    return res.json({
      country: location?.country ?? null,
      currencyCode,
      plans: localizedPlans,
      manuals: localizedManuals,
      workshops: localizedWorkshops,
    });
  },
};
