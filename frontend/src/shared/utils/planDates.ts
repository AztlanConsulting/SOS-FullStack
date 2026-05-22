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
      new Date(a.createdAt ?? 0).getTime() -
      new Date(b.createdAt ?? 0).getTime(),
  );

  const expiries: Date[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const plan = sorted[index];
    const createdAt = new Date(plan.createdAt ?? 0);
    const durationMs = plan.duration * 24 * 60 * 60 * 1000;

    if (index === 0) {
      expiries.push(new Date(createdAt.getTime() + durationMs));
      continue;
    }

    const previousExpiry = expiries[index - 1];

    // If this plan was created before the previous one ended, extend from the prior computed expiry.
    if (createdAt.getTime() < previousExpiry.getTime()) {
      expiries.push(new Date(previousExpiry.getTime() + durationMs));
      continue;
    }

    // Otherwise, this plan starts a new independent timeline.
    expiries.push(new Date(createdAt.getTime() + durationMs));
  }

  return expiries;
};
