import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';
import { PlanDataAccess } from '@/infrastructure/data-access/plan.data-access';
import { WorkshopDataAccess } from '@/infrastructure/data-access/workshop.data-access';
import { paymentDetails } from '@/types/payment.types';
import type { CustomPlanData } from '@/types/plan.types';
import { getManualByIdDB } from '@/use-cases/manuals/getManualsDB.usecase';
import getPlanByName from '@/use-cases/plans/getPlanByName.usecase';
import { getWorkshopById } from '@/use-cases/workshops/getWorkshops.usecase';
import { calculatePrice } from '@/utils/calculateCustomPlan';
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

    const realPrice = await (data.product
      ? verifyProduct(data.product!.productId)
      : (data.plan.planName &&
          verifyPlan(data.plan.planName, data.plan.planDetails)) ||
        null);

    // if (realPrice && realPrice != data.amount) throw Error('Amount forgery');

    if (!realPrice) throw Error('Amount forgery, item does not exists');

    req.body.amount = realPrice;

    console.log(realPrice);

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

export default confirmPaymentAmount;
