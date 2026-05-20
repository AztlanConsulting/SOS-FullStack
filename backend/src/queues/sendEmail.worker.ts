import { Worker } from 'bullmq';
import { redis } from './redis';
import { emailService } from '@infrastructure/services/email.service';
import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { purchasedPlanDataAccess } from '@infrastructure/data-access/purchasedPlan.data-access';
import { petDataAccess } from '@/infrastructure/data-access/pet.data-access';

/**
 * Worker responsible for:
 * - Validating email delivery dependencies
 * - Sending activation emails
 * - Persisting email delivery status
 * - Preventing duplicated email sends
 */
new Worker(
  'send-email',

  async (job) => {
    try {
      console.log('Email job started:', job.id);

      const { userEmail, planId } = job.data;

      const user = await userDataAccess.getUserByEmail(userEmail);

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      const purchasedPlan =
        await purchasedPlanDataAccess.getPurchasedPlanById(planId);

      if (!purchasedPlan) {
        throw new Error('PLAN_NOT_FOUND');
      }

      const pet = await petDataAccess.getPetById(
        purchasedPlan.petId.toString(),
      );

      if (!pet) {
        throw new Error('PET_NOT_FOUND');
      }

      // Prevent duplicated email delivery
      if (purchasedPlan.emailStatus === 'sent') {
        console.log('Email already sent');
        return;
      }

      await emailService.sendActivatePlanEmail({
        to: user.email,
        username: user.email,
        password: pet.name,
        facebookUrl: purchasedPlan.socialPosts?.facebook?.url ?? '',
        instagramUrl: purchasedPlan.socialPosts?.instagram?.url ?? '',
      });

      await purchasedPlanDataAccess.updateEmailStatus(planId, 'sent');

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Email job failed:', error);

      throw error;
    }
  },
  {
    connection: redis,
  },
);
