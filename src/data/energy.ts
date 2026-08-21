/**
 * Emlah'ın Enerjisi — a visible resource, separate from the existing
 * hidden fatigue math (scoring.ts's fatigueSuspicion/fatigueFactor stay
 * completely untouched). Depletes a fixed amount per house entered; when
 * it drops below the low threshold, suspicion gained from choices is
 * multiplied up a bit — exactly the same kind of factor
 * suspicionGainFactor/difficultyMultiplier already are, just one more
 * multiplicand in the same formula.
 *
 * Three real recovery paths (see EnergyBreakScreen.tsx):
 *  - Mini oyunlar: +MINIGAME_ENERGY_GAIN per successful play, up to
 *    MINIGAME_MAX_PLAYS plays, then locked for MINIGAME_COOLDOWN_MS of
 *    real wall-clock time (device clock, not in-game date — mobile-first).
 *  - Reklam izleme: UI placeholder for now, wired later.
 *  - Enerji satın alma: UI placeholder for now, wired later (existing
 *    market energyFill perks already cover a paid path meanwhile).
 * Plus a slow passive drip: PASSIVE_REGEN_PER_HOUR for every real hour
 * that passes, computed off a persisted timestamp so it still applies
 * after the app was closed and reopened.
 */
export const ENERGY_MAX = 100;
/** ~%30 per house, per the "her ev denemesinde enerji gitsin" brief. */
export const ENERGY_DEPLETION_PER_HOUSE = 30;
export const ENERGY_LOW_THRESHOLD = 30;
/** Below this, Emlah can't take on today's job at all — he has to recover some energy first. See data/energyBreak.ts. */
export const ENERGY_WORK_MIN_THRESHOLD = 20;
export const ENERGY_LOW_SUSPICION_MULTIPLIER = 1.2;
/** A little energy comes back naturally each week (goal-completion reward, independent of the hourly passive drip below). */
export const WEEKLY_ENERGY_REGEN = 25;

/** Real-clock passive regen — device time, not the in-game calendar. */
export const PASSIVE_REGEN_PER_HOUR = 10;
export const MINIGAME_ENERGY_GAIN = 10;
export const MINIGAME_MAX_PLAYS = 2;
export const MINIGAME_COOLDOWN_MS = 3 * 60 * 60 * 1000;

/**
 * Whole real hours elapsed since `lastRegenAt` become energy, rounding
 * down so partial hours carry over to the next check instead of being
 * lost — `newLastRegenAt` only advances by the whole hours consumed.
 */
export function computePassiveEnergyRegen(
  lastRegenAt: number,
  now: number,
): { gained: number; newLastRegenAt: number } {
  const hoursElapsed = Math.floor((now - lastRegenAt) / (60 * 60 * 1000));
  if (hoursElapsed <= 0) return { gained: 0, newLastRegenAt: lastRegenAt };
  return { gained: hoursElapsed * PASSIVE_REGEN_PER_HOUR, newLastRegenAt: lastRegenAt + hoursElapsed * 60 * 60 * 1000 };
}

/** Plays-remaining as of `now` — auto-refills to MINIGAME_MAX_PLAYS once the cooldown has passed, without needing a separate persisted "refill" event. */
export function effectiveMinigamePlaysRemaining(playsRemaining: number, nextAvailableAt: number, now: number): number {
  return now >= nextAvailableAt ? MINIGAME_MAX_PLAYS : playsRemaining;
}
