import { Worker } from 'bullmq';
import { redis } from './redis';
import { metaPublisher } from '@infrastructure/api/meta.api';
import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { petDataAccess } from '@infrastructure/data-access/pet.data-access';
import { purchasedPlanDataAccess } from '@infrastructure/data-access/purchasedPlan.data-access';
import { sendEmailQueue } from './sendEmail.queue';
import type { Pet } from '@/domain/models/pet.model';

/**
 * Worker responsible for:
 * - Validating payment-related resources
 * - Publishing posts to Facebook and Instagram
 * - Persisting social post checkpoints
 * - Triggering the confirmation email queue
 */
new Worker(
  'payment-confirmation',

  async (job) => {
    try {
      console.log('Job started:', job.id);

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

      const facebookAlreadyPosted =
        purchasedPlan.socialPosts?.facebook?.status === 'posted';

      const instagramAlreadyPosted =
        purchasedPlan.socialPosts?.instagram?.status === 'posted';

      const emailAlreadySent = purchasedPlan.emailStatus === 'sent';

      if (facebookAlreadyPosted && instagramAlreadyPosted && emailAlreadySent) {
        console.log('Plan already fully processed');
        return;
      }

      const isProduction = process.env.ENV === 'production';
      const caption = buildPetPostCaption(pet, user.phone);
      const imageUrl = isProduction
        ? (pet.photos?.at(-1) ?? '')
        : 'https://picsum.photos/id/237/1200/1200.jpg';

      if (!facebookAlreadyPosted) {
        try {
          console.log('Publishing to Facebook...');

          const fb = await metaPublisher.publishToFacebook({
            imageUrl,
            caption,
          });

          // Persist Facebook publish checkpoint immediately
          await purchasedPlanDataAccess.updatePurchasedPlanSocialPosts(planId, {
            facebook: {
              url: fb.url,
              status: 'posted',
              postedAt: new Date(),
            },
          });

          console.log('Facebook post published:', fb.url);
        } catch (error) {
          console.error('Facebook publish error:', error);

          throw error;
        }
      }

      if (!instagramAlreadyPosted) {
        try {
          console.log('Publishing to Instagram...');

          const ig = await metaPublisher.publishToInstagram({
            imageUrl,
            caption,
          });

          // Persist Instagram publish checkpoint immediately
          await purchasedPlanDataAccess.updatePurchasedPlanSocialPosts(planId, {
            instagram: {
              url: ig.url,
              status: 'posted',
              postedAt: new Date(),
            },
          });

          console.log('Instagram post published:', ig.url);
        } catch (error) {
          console.error('Instagram publish error:', error);

          throw error;
        }
      }

      const latestPlan =
        await purchasedPlanDataAccess.getPurchasedPlanById(planId);

      if (!latestPlan) {
        throw new Error('PLAN_NOT_FOUND_AFTER_UPDATE');
      }

      const facebookDone =
        latestPlan.socialPosts?.facebook?.status === 'posted';

      const instagramDone =
        latestPlan.socialPosts?.instagram?.status === 'posted';

      // Send email only after both social posts are completed
      if (facebookDone && instagramDone && latestPlan.emailStatus !== 'sent') {
        await sendEmailQueue.add(
          'send-email-job',
          {
            userEmail: user.email,
            planId,
            petName: pet.name,
          },
          {
            jobId: `send-email-${planId}`,
            attempts: 5,
            backoff: {
              type: 'exponential',
              delay: 5000,
            },
            removeOnComplete: {
              age: 3600,
            },
            removeOnFail: false,
          },
        );

        console.log('Email job queued');
      }

      console.log('Publishing workflow completed');
    } catch (error) {
      console.error('Job failed:', error);

      throw error;
    }
  },
  {
    connection: redis,
  },
);

/**
 * Builds the social media caption used for Facebook and Instagram posts.
 *
 * @param pet - Missing pet information
 * @param phone - Contact phone number
 * @returns Formatted caption string
 */
function buildPetPostCaption(pet: Pet, phone: string): string {
  let speciesEmoji: string;

  switch (pet.species.toLowerCase()) {
    case 'perro':
      speciesEmoji = '🐕';
      break;
    case 'gato':
      speciesEmoji = '🐈';
      break;
    case 'ave':
      speciesEmoji = '🐦';
      break;
    default:
      speciesEmoji = '🐾';
      break;
  }

  const date = new Date(pet.dateMissing);

  const formattedDate = date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
  });

  return `🐾 Responde al nombre de ${pet.name.toUpperCase()}
📍 Se extravió el ${formattedDate} en ${pet.placeMissing}
${speciesEmoji} ${pet.description} 
☎️ Si le ven favor de resguardar y llamar al ${phone}`;
}
