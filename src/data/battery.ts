import { resolveText, type Localized } from "./language";
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
const LOW_BATTERY_LINE_TEXT: Localized = { tr: "Şarjım bitmek üzere, kısa keseyim...", en: "My battery's almost dead, let me keep this short..." };
export function lowBatteryLine(): string {
  return resolveText(LOW_BATTERY_LINE_TEXT);
}

const customerReplies: Localized[] = [
  { tr: "Tamam, müsait olduğunuzda devam ederiz.", en: "Okay, we can continue whenever you are available." },
  { tr: "Sorun değil, sonra tekrar yazışalım.", en: "No problem, let's chat again later." },
  { tr: "Anladım, iyi şarjlar 😄", en: "Understood, happy charging 😄" },
  { tr: "Peki, bekliyorum o zaman.", en: "Alright, I'll wait then." },
];

const casualReplies: Localized[] = [
  { tr: "Yine mi? Powerbank alsana artık 😂", en: "Again? Just get a powerbank already 😂" },
  { tr: "Tamam kanka, şarj olunca yaz.", en: "Alright bro, text me when it's charged." },
  { tr: "Emlah sen bu telefonla nasıl iş yapıyorsun ya 😅", en: "Estetan, how do you even do business with that phone 😅" },
  { tr: "Git şarja tak, ben buradayım.", en: "Go plug it in, I'll be right here." },
];

export type LowBatteryReplyKind = "customer" | "casual";

export function pickLowBatteryReply(kind: LowBatteryReplyKind): string {
  const pool = kind === "customer" ? customerReplies : casualReplies;
  return resolveText(pool[Math.floor(Math.random() * pool.length)]);
}
