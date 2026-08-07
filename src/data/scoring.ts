import type { GameStats, SceneOutcome } from "../types";

/**
 * Turns accumulated dialogue stats + the closing choice's bias into a final
 * outcome. Higher interest/fun and a generous closing push toward "sold";
 * high suspicion drags it toward "lost" even if the closing choice was
 * generous — so early dishonesty has a real, felt cost instead of being
 * cosmetic.
 *
 * Thresholds are tuned so an outright "sold" on the first visit is a real
 * accomplishment, not the default outcome — most decent playthroughs land
 * on "thinking" and get resolved later through a WhatsApp follow-up
 * negotiation (see callbacks.ts) instead.
 */
export function resolveOutcome(stats: GameStats, closingBias: number): SceneOutcome {
  const score = stats.interest + stats.fun - stats.suspicion * 1.1 + closingBias;
  if (score >= 50) return "sold";
  if (score >= -20) return "thinking";
  return "lost";
}

export const STREAK_BONUS_RATE = 0.1; // +10% commission per streak step
export const STREAK_BONUS_CAP = 0.3; // capped at +30%

export function streakMultiplier(currentStreak: number): number {
  return Math.min(currentStreak * STREAK_BONUS_RATE, STREAK_BONUS_CAP);
}
