import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';
import { PlanDataAccess } from '@/infrastructure/data-access/plan.data-access';
import { WorkshopDataAccess } from '@/infrastructure/data-access/workshop.data-access';
import { paymentDetails } from '@/types/payment.types';
import type { CustomPlanData } from '@/types/plan.types';
import { getManualByIdDB } from '@/use-cases/manuals/getManualsDB.usecase';
import getPlanByName from '@/use-cases/plans/getPlanByName.usecase';
import { getWorkshopById } from '@/use-cases/workshops/getWorkshops.usecase';
import { calculatePrice, getTier } from '@/utils/calculateCustomPlan';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { getPlansDB } from '@/use-cases/plans/getPlansDB.usecase';

async function confirmPaymentAmount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const paymentDetail = paymentDetails.safeParse(req.body);
    if (paymentDetail.error) throw paymentDetail.error;

    const data = paymentDetail.data;

    const realPrice = await (data.extensionPlan
      ? verifyExtensionPlan(data.extensionPlan)
      : data.product
        ? verifyProduct(data.product.productId)
        : (data.plan?.planName &&
            verifyPlan(data.plan.planName, data.plan.planDetails)) ||
          null);

    // if (realPrice && realPrice != data.amount) throw Error('Amount forgery');

    if (realPrice === null) throw Error('Amount forgery, item does not exist');

    next();
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      res.status(400).send('Zod error');
    }
    res.status(402).send('Amount forgery attempt');
  }
}

async function verifyProduct(productId: string): Promise<number | null> {
  const manual = await getManualByIdDB(ManualDataAccess, productId);
  const workshop = await getWorkshopById(WorkshopDataAccess, productId);

  return manual ? manual.price : workshop ? workshop.price : null;
}

async function verifyPlan(
  planName: string,
  customPlanData?: CustomPlanData,
): Promise<number | null> {
  if (planName === 'Personalizado' && customPlanData)
    return calculatePrice(customPlanData);

  const plan = await getPlanByName(PlanDataAccess, planName);

  return plan?.price ?? null;
}

async function verifyExtensionPlan(planOrObj: any): Promise<number | null> {
  // If an object is provided (extension plan payload), handle 'Personalizado' specially
  if (planOrObj && typeof planOrObj === 'object') {
    const ext = planOrObj as {
      name?: string;
      duration?: number;
      radius?: number;
      features?: string[];
      price?: number;
    };

    if (ext.name === 'Personalizado' && typeof ext.duration === 'number') {
      // Map feature labels back to keys using the pricing tier for the provided duration
      const tier = getTier(ext.duration, 'purple');
      const selectedKeys = (ext.features ?? []).reduce<string[]>(
        (acc, fLabel) => {
          const match = tier.features.find(
            (tf) => tf.label === fLabel || tf.key === fLabel,
          );
          if (match) acc.push(match.key);
          return acc;
        },
        [],
      );

      const price = calculatePrice(
        {
          days: ext.duration,
          km: ext.radius ?? 0,
          selectedFeatures: selectedKeys,
        },
        'purple',
      );
      return price;
    }
    // If not a personalizado custom object, try DB lookup by name below
    const planName = ext.name;
    if (!planName) return null;
    const plans = await getPlansDB(PlanDataAccess);
    const plan = plans.find(
      (item) => item.name === planName && item.discounted,
    );
    if (!plan || !plan.discounted) return null;
    return plan.price;
  }

  // Fallback: treat input as planName string
  const plans = await getPlansDB(PlanDataAccess);
  const plan = plans.find((item) => item.name === planOrObj && item.discounted);

  if (!plan || !plan.discounted) {
    return null;
  }

  return plan.price;
}

export default confirmPaymentAmount;
