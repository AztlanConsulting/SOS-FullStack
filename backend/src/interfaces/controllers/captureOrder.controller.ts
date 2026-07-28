import type { Request, Response } from 'express';
import logger from '@/utils/logger';
import { default as ucCaptureOrder } from '@use-cases/payments/captureOrder';
import paypalApi from '@infrastructure/api/paypal.api';
import { PaymentDataAccess } from '@infrastructure/data-access/payment.data-access';
import { markAsSucceededDB } from '@/use-cases/payments/markAsSuccededDB.usecase';
import { createPurchaseDB } from '@/use-cases/purchases/createPurchaseDB.usecase';
import { PurchaseDataAccess } from '@infrastructure/data-access/purchase.data-access';
import { purchaseDetailsSchema } from '@validation/payment.types';
import { activatePlan } from '@/use-cases/plans/activatePlan.usecase';
import { userDataAccess } from '@/infrastructure/data-access/user.data-access';
import { purchasedPlanDataAccess } from '@/infrastructure/data-access/purchasedPlan.data-access';
import { getManualByIdDB } from '@/use-cases/manuals/getManualsDB.usecase';
import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';
import { sendManualEmailService } from '@/infrastructure/service/sendManualEmail.service';
import { sendManualEmail } from '@/use-cases/emails/sendManualEmail.usecase';
import { WorkshopDataAccess } from '@/infrastructure/data-access/workshop.data-access';
import { sendWorkshopEmailService } from '@/infrastructure/service/sendWorkshopEmail.service';
import { sendWorkshopEmail } from '@/use-cases/emails/sendWorkshopEmail.usecase';
import { getWorkshopById } from '@/use-cases/workshops/getWorkshops.usecase';
import { Types } from 'mongoose';

export default async function captureOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    const details = purchaseDetailsSchema.safeParse(req.body);
    if (details.error) {
      logger.error('captureOrder validation failed', {
        error: details.error,
        body: req.body,
      });
      throw details.error;
    }

    const { purchaseDetails, planId, extensionPlan } = details.data;
    const { userEmail, productId, productType } = purchaseDetails;

    const capturedOrder = await ucCaptureOrder(paypalApi, orderId as string);

    if (Boolean(capturedOrder.error)) throw capturedOrder.error;

    await markAsSucceededDB(PaymentDataAccess, String(orderId));

    let purchasedPlanId = planId || productId!;

    if (extensionPlan) {
      if (!Types.ObjectId.isValid(extensionPlan.petId)) {
        logger.error('captureOrder invalid extension plan petId', {
          extensionPlan,
        });
        return res.status(400).json({ error: 'Invalid extension plan petId' });
      }

      const purchasedPlan = await purchasedPlanDataAccess.createPurchasedPlan({
        petId: new Types.ObjectId(extensionPlan.petId),
        name: extensionPlan.name,
        price: extensionPlan.price,
        duration: extensionPlan.duration,
        radius: extensionPlan.radius,
        features: extensionPlan.features,
        status: 'continua',
      });

      purchasedPlanId = purchasedPlan._id.toString();
    }

    if (productType === 'plan' || extensionPlan) {
      await activatePlan(
        userDataAccess,
        purchasedPlanDataAccess,
        userEmail,
        purchasedPlanId,
      );
    }

    if (productType === 'manual') {
      const manualData = await getManualByIdDB(
        ManualDataAccess,
        productId as string,
      );
      if (manualData) {
        const { name, imageUrl, pdfUrl, emailContent } = manualData;
        await sendManualEmail(sendManualEmailService, {
          to: userEmail,
          manualName: name,
          imageUrl,
          pdfUrl,
          emailContent,
        });
      }
    }

    if (productType === 'taller') {
      const workshopData = await getWorkshopById(
        WorkshopDataAccess,
        productId as string,
      );
      if (workshopData) {
        const { name, imageUrl, videoUrl, emailContent } = workshopData;
        await sendWorkshopEmail(sendWorkshopEmailService, {
          to: userEmail,
          workshopName: name,
          imageUrl: imageUrl ?? '',
          videoUrl: videoUrl ?? '',
          emailContent: emailContent ?? '',
        });
      }
    }

    await createPurchaseDB(PurchaseDataAccess, {
      userEmail,
      paymentId: capturedOrder.id!,
      productId: purchasedPlanId,
      productType: extensionPlan ? 'plan-extension' : productType,
    });

    if (capturedOrder.id !== undefined)
      return res.status(200).send(capturedOrder.id);
  } catch (error) {
    logger.error('captureOrder error', {
      error,
      orderId: req.params.orderId,
      body: req.body,
    });
    const message =
      error instanceof Error ? error.message : 'Failed to capture order';
    res.status(500).json({ error: message });
  }
}
