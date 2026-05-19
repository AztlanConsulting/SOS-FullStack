/**
 * Utility function to calculate chronological expiration timelines for accounts
 * that hold multiple active or sequential subscription plans.
 * * Logic Overview:
 * 1. Sorts plans sequentially by creation date to establish an audit trail.
 * 2. Checks if an active sub-tier sequence is already running.
 * 3. Accounts for overlaps by dynamically "stacking" newly appended cycles
 * onto the exact millisecond where previous valid periods wrap up.
 * * @param plans - List of raw plan objects with durations (in days) and creation timestamps.
 * @returns {Date[]} An array of structured expiration targets matching each mapped ledger position.
 */
export const calculateStackedExpiry = (
  plans: { createdAt?: string; duration: number }[],
): Date[] => {
  const sorted = [...plans].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );

  const now = new Date();

  return sorted.map((plan, index) => {
    const durationMs = plan.duration * 24 * 60 * 60 * 1000;

    /**
     * Stack Evaluation:
     * If evaluating the absolute latest purchase execution, check if it was
     * checked out while an identical prior commitment was still actively running.
     */
    if (index === 0 && sorted.length > 1) {
      const prevPlan = sorted[1];
      const prevExpiry = new Date(
        new Date(prevPlan.createdAt ?? 0).getTime() +
          prevPlan.duration * 24 * 60 * 60 * 1000,
      );
      // If the older plan hasn't expired yet, append this duration to its end date
      if (prevExpiry > now) {
        const remaining = prevExpiry.getTime() - now.getTime();
        return new Date(now.getTime() + remaining + durationMs);
      }
    }

    // Default: Standalone timeline generation using isolated data inputs
    return new Date(new Date(plan.createdAt ?? 0).getTime() + durationMs);
  });
};
