import { resolveText, type Localized } from "./language";
/**
 * Patron Memnuniyeti — Muzaffer Bey's mood toward Emlah, 0-100, persisted.
 * Discounting too hard on a sale annoys him; clean sales and hitting the
 * week's sales target please him. At each week boundary it gates a small
 * "haftalık zam" bonus — entirely additive on top of the existing
 * sales/honesty week bonus (see goals.ts evaluateWeek), never touches
 * resolveOutcome or any core scoring math.
 */
export const BOSS_MOOD_MAX = 100;
export const BOSS_MOOD_START = 65;

/** discountPercent above this on a sold house annoys the boss. */
export const DISCOUNT_ANGER_THRESHOLD = 8;
export const BOSS_MOOD_DISCOUNT_PENALTY = 10;
export const BOSS_MOOD_CLEAN_SALE_GAIN = 4;
export const BOSS_MOOD_WEEK_GOAL_GAIN = 6;

export const BOSS_MOOD_RAISE_THRESHOLD = 40;
export const WEEKLY_RAISE_AMOUNT = 20000;

export function clampBossMood(value: number): number {
  return Math.max(0, Math.min(BOSS_MOOD_MAX, value));
}

/** Mood delta from a single sale, based on how much was negotiated off the asking price. */
export function bossMoodDeltaForSale(discountPercent: number): number {
  return discountPercent > DISCOUNT_ANGER_THRESHOLD ? -BOSS_MOOD_DISCOUNT_PENALTY : BOSS_MOOD_CLEAN_SALE_GAIN;
}

const discountAngerLines: Localized[] = [
  { tr: "Yine indirim mi yaptın Emlah, böyle gidersek zor durumda kalırız.", en: "Did you give another discount Estetan, we'll be in trouble at this rate." },
  { tr: "Bu kadar taviz vermeyi bırakmalısın, kâr marjımız eriyor.", en: "You need to stop making so many concessions, our profit margin is eroding." },
  { tr: "İndirim üstüne indirim... bu şirketin cebinden çıkıyor, unutma.", en: "Discount after discount... this is coming out of the company's pocket, remember." },
];

const cleanSaleLines: Localized[] = [
  { tr: "İşte bu, tam fiyatına sattın — böyle devam et Emlah.", en: "There it is, you sold it at full price — keep it up Estetan." },
  { tr: "Pazarlığı iyi tuttun, tebrikler.", en: "You held your ground well in negotiations, congrats." },
];

export function pickDiscountAngerLine(): string {
  return resolveText(discountAngerLines[Math.floor(Math.random() * discountAngerLines.length)]);
}

export function pickCleanSaleLine(): string {
  return resolveText(cleanSaleLines[Math.floor(Math.random() * cleanSaleLines.length)]);
}
