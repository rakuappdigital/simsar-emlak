import type { HouseResult, WeekGoal, WeekOutcome } from "../types";

export const HOUSES_PER_WEEK = 5;

export const weekGoals: WeekGoal[] = [
  { weekIndex: 0, salesTarget: 2, maxAvgSuspicion: 40 },
  { weekIndex: 1, salesTarget: 3, maxAvgSuspicion: 35 },
  { weekIndex: 2, salesTarget: 3, maxAvgSuspicion: 30 },
  { weekIndex: 3, salesTarget: 4, maxAvgSuspicion: 25 },
];

export function weekIndexForHouse(houseIndex: number): number {
  return Math.floor(houseIndex / HOUSES_PER_WEEK);
}

export function isLastHouseOfWeek(houseIndex: number): boolean {
  return houseIndex % HOUSES_PER_WEEK === HOUSES_PER_WEEK - 1;
}

export function evaluateWeek(weekIndex: number, weekResults: HouseResult[]): WeekOutcome {
  const goal = weekGoals[weekIndex];
  const salesMade = weekResults.filter((r) => r.outcome === "sold").length;
  const avgSuspicion =
    weekResults.reduce((sum, r) => sum + r.finalSuspicion, 0) / (weekResults.length || 1);

  const salesGoalMet = salesMade >= goal.salesTarget;
  const honestyGoalMet = avgSuspicion <= goal.maxAvgSuspicion;

  let bonus = 0;
  if (salesGoalMet) bonus += 40000;
  if (honestyGoalMet) bonus += 30000;

  return {
    weekIndex,
    salesTarget: goal.salesTarget,
    salesMade,
    maxAvgSuspicion: goal.maxAvgSuspicion,
    avgSuspicion,
    salesGoalMet,
    honestyGoalMet,
    bonus,
  };
}
