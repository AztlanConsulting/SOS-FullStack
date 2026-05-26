import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';
import { PlanDataAccess } from '@/infrastructure/data-access/plan.data-access';
import { WorkshopDataAccess } from '@/infrastructure/data-access/workshop.data-access';
import { ExchangeRateApiService } from '@/infrastructure/api/exhangeRate.api';
import { paymentDetails } from '@/types/payment.types';
import type { CustomPlanData } from '@/types/plan.types';
import { getManualByIdDB } from '@/use-cases/manuals/getManualsDB.usecase';
import { getPlansDB } from '@/use-cases/plans/getPlansDB.usecase';
import { getWorkshopById } from '@/use-cases/workshops/getWorkshops.usecase';
import { getLocalizedPricing } from '@/use-cases/ip/getLocalizedPricing.usecase';
import { calculatePrice, getTier } from '@/utils/calculateCustomPlan';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

async function confirmPaymentAmount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const paymentDetail = paymentDetails.safeParse(req.body);
    if (paymentDetail.error) throw paymentDetail.error;

    const data = paymentDetail.data;

    const expectedAmount = await (data.extensionPlan
      ? verifyExtensionPlan(data.extensionPlan, data.currency)
      : data.product
        ? verifyProduct(data.product.productId, data.currency)
        : (data.plan?.planName &&
            verifyPlan(
              data.plan.planName,
              data.plan.planDetails,
              data.currency,
            )) ||
          null);

    if (expectedAmount === null) {
      throw Error('Amount forgery, item does not exists');
    }

    const normalizedClientAmount = Math.round(data.amount);
    const normalizedExpectedAmount = Math.round(expectedAmount);

    if (normalizedClientAmount !== normalizedExpectedAmount) {
      throw Error('Amount forgery');
    }

    req.body.amount = normalizedExpectedAmount;
    req.body.currency = data.currency.toUpperCase();

    next();
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      res.status(400).send('Zod error');
    }
    res.status(402).send('Amount forgery attempt');
  }
}

async function localizeAmount(
  amount: number,
  currencyCode: string,
): Promise<number> {
  const [localizedAmount] = await getLocalizedPricing(
    currencyCode,
    [{ name: 'amount', price: amount }],
    ExchangeRateApiService,
  );

  return localizedAmount?.localizedPrice ?? amount;
}

async function verifyProduct(
  productId: string,
  currencyCode: string,
): Promise<number | null> {
  const manual = await getManualByIdDB(ManualDataAccess, productId);
  const workshop = await getWorkshopById(WorkshopDataAccess, productId);

  const basePrice = manual ? manual.price : workshop ? workshop.price : null;

  return basePrice === null
    ? null
    : await localizeAmount(basePrice, currencyCode);
}

async function verifyPlan(
  planName: string,
  customPlanData?: CustomPlanData,
  currencyCode?: string,
): Promise<number | null> {
  if (!currencyCode) return null;

  if (planName === 'Personalizado' && customPlanData)
    return await localizeAmount(calculatePrice(customPlanData), currencyCode);

  const plans = await getPlansDB(PlanDataAccess);
  const plan = plans.find((item) => item.name === planName && !item.discounted);

  return plan?.price === undefined
    ? null
    : await localizeAmount(plan.price, currencyCode);
}

async function verifyExtensionPlan(
  planOrObj: {
    name: string;
    duration: number;
    radius: number;
    features: string[];
  },
  currencyCode?: string,
): Promise<number | null> {
  if (!currencyCode) return null;

  if (planOrObj && typeof planOrObj === 'object') {
    if (
      planOrObj.name === 'Personalizado' &&
      typeof planOrObj.duration === 'number'
    ) {
      // Convert custom-plan feature labels back to keys expected by the pricing util.
      const tier = getTier(planOrObj.duration, 'purple');
      const selectedKeys = (planOrObj.features ?? []).reduce<string[]>(
        (acc, featureLabel) => {
          const match = tier.features.find(
            (feature) =>
              feature.label === featureLabel || feature.key === featureLabel,
          );
          if (match) acc.push(match.key);
          return acc;
        },
        [],
      );

      const customPlanPrice = calculatePrice(
        {
          days: planOrObj.duration,
          km: planOrObj.radius ?? 0,
          selectedFeatures: selectedKeys,
        },
        'purple',
      );

      return await localizeAmount(customPlanPrice, currencyCode);
    }

    const plans = await getPlansDB(PlanDataAccess);
    const plan = plans.find(
      (item) => item.name === planOrObj.name && item.discounted,
    );

    return plan?.price === undefined
      ? null
      : await localizeAmount(plan.price, currencyCode);
  }

  return null;
}

export default confirmPaymentAmount;
