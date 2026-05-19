import type { Request, Response } from 'express';
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

export default async function captureOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    const details = purchaseDetailsSchema.safeParse(req.body);
    if (details.error) throw details.error;

    const { purchaseDetails, planId } = details.data;
    const { userEmail, productId, productType } = purchaseDetails;

    const capturedOrder = await ucCaptureOrder(paypalApi, orderId as string);

    if (Boolean(capturedOrder.error)) throw capturedOrder.error;

    const result = await markAsSucceededDB(PaymentDataAccess, String(orderId));

    if (productType === 'plan') {
      await activatePlan(
        userDataAccess,
        purchasedPlanDataAccess,
        userEmail,
        planId!,
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

    if (result === 'not_found' || result === 'already_updated') {
      console.warn('Payment not found in DB or already updated');
    }

    let id: string | undefined = productId;
    if (!Boolean(productId)) {
      id = planId!; // Register plan details and return id
    }

    await createPurchaseDB(PurchaseDataAccess, {
      userEmail,
      paymentId: capturedOrder.id!,
      productId: productId ?? id!,
      productType,
    });

    if (capturedOrder.id !== undefined)
      return res.status(200).send(capturedOrder.id);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
