import { Worker } from 'bullmq';
import { redisConnection } from './redis';
import { emailService } from '@/infrastructure/service/email.service';
import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { purchasedPlanDataAccess } from '@infrastructure/data-access/purchasedPlan.data-access';
import { petDataAccess } from '@/infrastructure/data-access/pet.data-access';
import bcrypt from 'bcryptjs';

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
        return;
      }

      const regex = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
      await emailService.sendActivatePlanEmail({
        to: user.email,
        ...(() =>
          regex.test(user.password)
            ? {}
            : { username: user.email, password: user.password })(),

        facebookUrl: purchasedPlan.socialPosts?.facebook?.url ?? '',
        instagramUrl: purchasedPlan.socialPosts?.instagram?.url ?? '',
      });

      await purchasedPlanDataAccess.updateEmailStatus(planId, 'sent');
      if (regex.test(user.password)) return;
      await userDataAccess.updateUserPassword(
        user.email,
        await bcrypt.hash(user.password, 10),
      );
    } catch (error) {
      throw error;
    }
  },
  {
    connection: redisConnection,
  },
);
