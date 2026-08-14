import type { HouseResult, WeekGoal, WeekOutcome } from "../types";

export const HOUSES_PER_WEEK = 5;

export const weekGoals: WeekGoal[] = [
  { weekIndex: 0, salesTarget: 2, maxAvgSuspicion: 40 },
  { weekIndex: 1, salesTarget: 3, maxAvgSuspicion: 35 },
  { weekIndex: 2, salesTarget: 3, maxAvgSuspicion: 30 },
  { weekIndex: 3, salesTarget: 4, maxAvgSuspicion: 25 },
  { weekIndex: 4, salesTarget: 4, maxAvgSuspicion: 22 },
  { weekIndex: 5, salesTarget: 4, maxAvgSuspicion: 20 },
  { weekIndex: 6, salesTarget: 5, maxAvgSuspicion: 18 },
  { weekIndex: 7, salesTarget: 5, maxAvgSuspicion: 16 },
  { weekIndex: 8, salesTarget: 5, maxAvgSuspicion: 15 },
  { weekIndex: 9, salesTarget: 5, maxAvgSuspicion: 15 },
];

export function weekIndexForHouse(houseIndex: number): number {
  return Math.floor(houseIndex / HOUSES_PER_WEEK);
}

export function isLastHouseOfWeek(houseIndex: number): boolean {
  return houseIndex % HOUSES_PER_WEEK === HOUSES_PER_WEEK - 1;
}

export function evaluateWeek(weekIndex: number, weekResults: HouseResult[]): WeekOutcome {
  // Clamp defensively: if the house count ever outgrows weekGoals again, reuse the
  // hardest defined week instead of crashing on an undefined lookup.
  const goal = weekGoals[Math.min(weekIndex, weekGoals.length - 1)];
  const salesMade = weekResults.filter((r) => r.outcome === "sold").length;
  const avgSuspicion =
    weekResults.reduce((sum, r) => sum + r.finalSuspicion, 0) / (weekResults.length || 1);

  const salesGoalMet = salesMade >= goal.salesTarget;
  const honestyGoalMet = avgSuspicion <= goal.maxAvgSuspicion;

  let bonus = 0;
  if (salesGoalMet) bonus += 40000;
  if (honestyGoalMet) bonus += 30000;

  const bestOfWeek = weekResults.reduce<HouseResult | null>((best, r) => {
    if (r.bestLine === undefined || r.bestLineFun === undefined) return best;
    if (!best || (best.bestLineFun ?? 0) < r.bestLineFun) return r;
    return best;
  }, null);

  return {
    weekIndex,
    salesTarget: goal.salesTarget,
    salesMade,
    maxAvgSuspicion: goal.maxAvgSuspicion,
    avgSuspicion,
    salesGoalMet,
    honestyGoalMet,
    bonus,
    bestLine: bestOfWeek?.bestLine,
  };
}
