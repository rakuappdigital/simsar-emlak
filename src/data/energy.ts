/**
 * Emlah'ın Enerjisi — a visible resource, separate from the existing
 * hidden fatigue math (scoring.ts's fatigueSuspicion/fatigueFactor stay
 * completely untouched). Depletes a fixed amount per house entered; when
 * it drops below the low threshold, suspicion gained from choices is
 * multiplied up a bit — exactly the same kind of factor
 * suspicionGainFactor/difficultyMultiplier already are, just one more
 * multiplicand in the same formula. Refilled by buying a drink, priced in
 * plain TL like everything else in the market — there's no separate fake
 * currency, just an instant-effect purchase instead of a stored item.
 */
export const ENERGY_MAX = 100;
/** Tuned so ~3 houses in a row without a refill pushes you into the low zone (matches "2-3 ev satamayacak şekilde"). */
export const ENERGY_DEPLETION_PER_HOUSE = 35;
export const ENERGY_LOW_THRESHOLD = 30;
export const ENERGY_LOW_SUSPICION_MULTIPLIER = 1.2;
/** A little energy comes back naturally each week, so the drink shop is a boost, not the only way forward. */
export const WEEKLY_ENERGY_REGEN = 25;
