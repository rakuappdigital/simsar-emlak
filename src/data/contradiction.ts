import type { ChoiceEffects } from "../types";
import { resolveText, type Localized } from "./language";

/**
 * "Çelişki Motoru" — turns the negotiation from "always pick the best
 * immediate stat delta" into something requiring the player to remember
 * what they already told the customer. Deliberately works off EFFECTS data
 * that's already authored on every choice (discountPercent/suspicion
 * signs), not free-text parsing — so it applies uniformly across all 54+
 * houses without touching a single line of hand-authored dialogue.
 *
 * Rule: if the player picks 2+ "confident, holding firm" choices (no
 * discount offered, suspicion reduced) earlier in the SAME visit, then
 * later suddenly offers a big discount, the customer notices the
 * about-face — same suspicion channel as any other effect (onChoiceEffects),
 * just a much sharper one-off penalty plus a visible callout line instead
 * of a silent number.
 */
export const HELD_FIRM_MIN_COUNT = 2;
export const DISCOUNT_CONTRADICTION_THRESHOLD = 8; // percentage points
export const CONTRADICTION_SUSPICION_PENALTY = 20;

/** Rank makes customers sharper, not friendlier — a contradiction stings more the further along Emlah's career is. See scoring.ts: rankTitle. */
export const contradictionRankMultiplier: Record<string, number> = {
  Stajyer: 1,
  Emlakçı: 1.15,
  "Kıdemli Emlakçı": 1.3,
  "Ofis Ortağı": 1.5,
};

export function isHeldFirmChoice(effects: ChoiceEffects | undefined): boolean {
  if (!effects) return false;
  const discount = effects.discountPercent ?? 0;
  const suspicion = effects.suspicion ?? 0;
  return discount <= 0 && suspicion < 0;
}

export function isDiscountContradiction(heldFirmCount: number, effects: ChoiceEffects | undefined): boolean {
  if (heldFirmCount < HELD_FIRM_MIN_COUNT) return false;
  return (effects?.discountPercent ?? 0) >= DISCOUNT_CONTRADICTION_THRESHOLD;
}

const discountContradictionLines: Localized[] = [
  { tr: "Az önce esneklik olmadığını söylemiştiniz, şimdi neden indirim yapıyorsunuz?", en: "You just said there was no flexibility, why are you offering a discount now?" },
  { tr: "Bir dakika, demin fiyatın kesin olduğunu söylemiştiniz...", en: "Wait a minute, you just said the price was firm..." },
  { tr: "İlginç, biraz önceki tavrınızla şimdiki teklifiniz pek uyuşmuyor.", en: "Interesting, your attitude just a moment ago doesn't quite match your current offer." },
];

export function pickDiscountContradictionLine(): string {
  return resolveText(discountContradictionLines[Math.floor(Math.random() * discountContradictionLines.length)]);
}

/**
 * A second, independent contradiction channel: negotiation TONE
 * whiplash across separate negotiation attempts on the SAME customer
 * (original closing choice vs a later retry/follow-up callback, or two
 * callbacks in a row) — "pushy" then "patient" (or vice versa) reads as
 * inconsistent, not just a strategy change. Empathetic is treated as
 * neutral (doesn't clash with either).
 */
export const NEGOTIATION_TONE_CONTRADICTION_PENALTY = 15;

export function isToneContradiction(lastTone: string | undefined, newToneId: string): boolean {
  if (!lastTone) return false;
  return (lastTone === "pushy" && newToneId === "patient") || (lastTone === "patient" && newToneId === "pushy");
}

const toneContradictionLines: Localized[] = [
  { tr: "Geçen sefer bambaşka bir tavrınız vardı, kafam biraz karıştı açıkçası.", en: "You had a completely different attitude last time, I'm a bit confused frankly." },
  { tr: "Önceki konuşmamızla şimdiki yaklaşımınız pek örtüşmüyor.", en: "Our previous conversation and your current approach don't quite align." },
  { tr: "Tutarlı olmadığınızı hissediyorum, açıkçası bu güvenimi sarstı.", en: "I feel like you're inconsistent, frankly this shook my trust." },
];

export function pickToneContradictionLine(): string {
  return resolveText(toneContradictionLines[Math.floor(Math.random() * toneContradictionLines.length)]);
}
