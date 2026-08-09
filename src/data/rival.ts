/**
 * Fırat Bey's "sales" are a purely cosmetic, deterministic pseudo-random
 * comparison — a flavor of competition on top of the week/career screens.
 * Never read by scoring, rewards, or any gameplay decision.
 */
export function rivalSalesForWeek(weekIndex: number): number {
  const seed = (weekIndex * 9301 + 49297) % 233280;
  return 1 + Math.floor((seed / 233280) * 4); // 1-4
}

export function rivalTotalSales(completedWeeks: number): number {
  let total = 0;
  for (let i = 0; i < completedWeeks; i++) total += rivalSalesForWeek(i);
  return total;
}
