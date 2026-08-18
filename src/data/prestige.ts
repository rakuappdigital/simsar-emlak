/**
 * Efsane Modu — Yeni Oyun+. Lives entirely outside the 3 save slots (its
 * own localStorage key, no SaveGame version bump) since it's lifetime
 * meta-progression across playthroughs, not state for a single run.
 * Finishing the game once unlocks a small starting-capital bonus (capped)
 * and a cosmetic title tag for every future run — never touches
 * resolveOutcome or any in-run scoring math, it only nudges bonusEarnings
 * once at the very start of a new game.
 */
const STORAGE_KEY = "simsar-emlak-prestige";

interface PrestigeData {
  completions: number;
}

function loadPrestige(): PrestigeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completions: 0 };
    const parsed = JSON.parse(raw);
    return { completions: typeof parsed.completions === "number" ? parsed.completions : 0 };
  } catch {
    return { completions: 0 };
  }
}

function savePrestige(data: PrestigeData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — prestige just won't carry over, gameplay still works
  }
}

export function getPrestigeCompletions(): number {
  return loadPrestige().completions;
}

/** Call exactly once when a playthrough finishes. Returns the new total. */
export function recordGameCompletion(): number {
  const next = loadPrestige().completions + 1;
  savePrestige({ completions: next });
  return next;
}

const PRESTIGE_BONUS_PER_COMPLETION = 15000;
const PRESTIGE_BONUS_CAP = 60000;

/** Starting bonusEarnings for a new run, based on completions before it. */
export function prestigeStartingBonus(completions: number): number {
  return Math.min(completions * PRESTIGE_BONUS_PER_COMPLETION, PRESTIGE_BONUS_CAP);
}

export function prestigeTitle(completions: number): string | null {
  if (completions <= 0) return null;
  if (completions === 1) return "Efsane";
  return `Efsane ${completions}`;
}
