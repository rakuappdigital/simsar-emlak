/**
 * Emlah'ın telefon şarjı — purely cosmetic, session-scoped flavor state (not
 * persisted, mirrors the rival-duel/mystery-shopper pattern). Recharges to
 * full every new house visit ("phone charged overnight") and randomly drains
 * a bit each time a phone-style screen is opened. Never touches suspicion,
 * discount, or any real scoring input — see App.tsx's callers, none of which
 * route this through applyEffects/scoring.ts.
 */
export const BATTERY_MAX = 100;
export const BATTERY_LOW_THRESHOLD = 20;
const BATTERY_DRAIN_CHANCE = 0.75;
const BATTERY_DRAIN_MIN = 5;
const BATTERY_DRAIN_MAX = 14;

export function maybeDrainBattery(current: number): number {
  if (Math.random() > BATTERY_DRAIN_CHANCE) return current;
  const amount = BATTERY_DRAIN_MIN + Math.floor(Math.random() * (BATTERY_DRAIN_MAX - BATTERY_DRAIN_MIN + 1));
  return Math.max(0, current - amount);
}

export const LOW_BATTERY_CHOICE_ID = "sarj-bitiyor";
export const LOW_BATTERY_LINE = "Şarjım bitmek üzere, kısa keseyim...";

const customerReplies = [
  "Tamam, müsait olduğunuzda devam ederiz.",
  "Sorun değil, sonra tekrar yazışalım.",
  "Anladım, iyi şarjlar 😄",
  "Peki, bekliyorum o zaman.",
];

const casualReplies = [
  "Yine mi? Powerbank alsana artık 😂",
  "Tamam kanka, şarj olunca yaz.",
  "Emlah sen bu telefonla nasıl iş yapıyorsun ya 😅",
  "Git şarja tak, ben buradayım.",
];

export type LowBatteryReplyKind = "customer" | "casual";

export function pickLowBatteryReply(kind: LowBatteryReplyKind): string {
  const pool = kind === "customer" ? customerReplies : casualReplies;
  return pool[Math.floor(Math.random() * pool.length)];
}
