import type { CustomerProfile, GameStats, SceneOutcome } from "../types";

export const DEFAULT_PROFILE: CustomerProfile = { suspicionWeight: 1.1, funWeight: 1, interestWeight: 1 };

/**
 * Soft cap so stacking the same stat over and over stops paying off linearly.
 * Values well under the cap are barely affected; only extreme stacking (well
 * past what a single house's dialogue can realistically produce) gets
 * meaningfully flattened.
 */
function diminish(value: number, cap = 120): number {
  if (value <= 0) return value;
  return value / (1 + value / cap);
}

/**
 * Turns accumulated dialogue stats + the closing choice's bias into a final
 * outcome. Higher interest/fun and a generous closing push toward "sold";
 * high suspicion drags it toward "lost" even if the closing choice was
 * generous — so early dishonesty has a real, felt cost instead of being
 * cosmetic. Each customer's `profile` (see CustomerProfile) can make them
 * more paranoid, more easygoing, or more analytical than the default.
 *
 * Thresholds are tuned so an outright "sold" on the first visit is a real
 * accomplishment, not the default outcome — most decent playthroughs land
 * on "thinking" and get resolved later through a WhatsApp follow-up
 * negotiation (see callbacks.ts) instead.
 */
export function resolveOutcome(
  stats: GameStats,
  closingBias: number,
  profile: CustomerProfile = DEFAULT_PROFILE,
): SceneOutcome {
  const score =
    diminish(stats.interest) * profile.interestWeight +
    diminish(stats.fun) * profile.funWeight -
    stats.suspicion * profile.suspicionWeight +
    closingBias;
  if (score >= 50) return "sold";
  if (score >= -20) return "thinking";
  return "lost";
}

export const STREAK_BONUS_RATE = 0.1; // +10% commission per streak step
export const STREAK_BONUS_CAP = 0.3; // capped at +30%

export function streakMultiplier(currentStreak: number): number {
  return Math.min(currentStreak * STREAK_BONUS_RATE, STREAK_BONUS_CAP);
}

/** Emlah's career rank, derived from lifetime earnings — a slow, visible ladder. */
export function rankTitle(earned: number): string {
  if (earned >= 1500000) return "Ofis Ortağı";
  if (earned >= 800000) return "Kıdemli Emlakçı";
  if (earned >= 300000) return "Emlakçı";
  return "Stajyer";
}

/** Small passive commission bonus that comes with rank — makes the ladder felt, not cosmetic. */
export function rankBonus(earned: number): number {
  if (earned >= 1500000) return 0.03;
  if (earned >= 800000) return 0.02;
  if (earned >= 300000) return 0.01;
  return 0;
}

const FATIGUE_PER_HOUSE = 3;
const FATIGUE_PER_HOUSE_RESTED = 1.5;

/** Starting suspicion penalty from showing houses back-to-back without a break, within the same week. */
export function fatigueSuspicion(positionInWeek: number, rested: boolean): number {
  return positionInWeek * (rested ? FATIGUE_PER_HOUSE_RESTED : FATIGUE_PER_HOUSE);
}
