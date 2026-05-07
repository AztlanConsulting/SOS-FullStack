import { activatePlanQueue } from '@/queues/activatePlan.queue';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { PurchasedPlanRepository } from '@domain/repositories/purchasedPlan.repository';

/**
 * Activates the purchased plan and queues the social media publishing job.
 *
 * Responsibilities:
 * - Validate the purchased plan existence
 * - Activate the user and plan only once
 * - Enqueue the asynchronous publishing workflow
 */
export const activatePlan = async (
  userRepository: UserRepository,
  purchasedPlanRepository: PurchasedPlanRepository,
  userEmail: string,
  planId: string,
): Promise<void> => {
  const purchasedPlan =
    await purchasedPlanRepository.getPurchasedPlanById(planId);

  if (!purchasedPlan) {
    throw new Error('PLAN_NOT_FOUND');
  }

  if (!purchasedPlan.active) {
    await userRepository.activateUser(userEmail);

    await purchasedPlanRepository.activatePurchasedPlan(planId);
  }

  /**
   * Queue the social media publishing workflow.
   *
   * BullMQ jobId ensures idempotency by preventing duplicated jobs
   * for the same purchased plan.
   */
  await activatePlanQueue.add(
    'publish-social-media',
    {
      userEmail,
      planId,
    },
    {
      jobId: `activate-plan-${planId}`,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: { age: 3000 },
      removeOnFail: false,
    },
  );
};
