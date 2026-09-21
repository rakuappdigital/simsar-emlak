import type { ChoiceEffects, CompassAxis } from "../types";
import { getLanguage } from "./language";

/**
 * "Değerler Pusulası" — tracks whether the player tends to pick choices
 * that calm a customer down (durustluk) or notably spook them (kurnazlik),
 * derived purely from the suspicion delta already present on every
 * hand-authored choice (no new tagging needed — in this game's own
 * fiction, suspicion already IS "does the customer suspect you're being
 * shady", so it's a natural, honest proxy). Deliberately does NOT touch
 * computeEnding()'s existing avgSuspicion-based logic — shown as a
 * separate verdict alongside the ending card instead of changing which
 * ending is picked, so the already-tuned ending thresholds stay untouched.
 */
export function classifyCompassChoice(effects: ChoiceEffects | undefined): CompassAxis | null {
  if (!effects) return null;
  const suspicion = effects.suspicion ?? 0;
  if (suspicion < 0) return "durustluk";
  if (suspicion > 5) return "kurnazlik";
  return null;
}

const MIN_SAMPLES_FOR_VERDICT = 5;

export function compassVerdict(tally: Record<CompassAxis, number>): string | null {
  const total = tally.durustluk + tally.kurnazlik;
  if (total < MIN_SAMPLES_FOR_VERDICT) return null;
  const ratio = (tally.durustluk - tally.kurnazlik) / total;
  const en = getLanguage() === "en";
  if (ratio > 0.3) return en ? "You generally chose to stay honest on this journey." : "Bu yolculukta genelde dürüst kalmayı seçtin.";
  if (ratio < -0.3) return en ? "You kept your cunning side handy throughout this journey." : "Bu yolculukta kurnazlığı elden bırakmadın.";
  return en ? "You remained undecided — sometimes honest, sometimes cunning." : "Kararsız kaldın — bazen dürüst, bazen kurnaz oldun.";
}
