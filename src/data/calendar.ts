import { HOUSES_PER_WEEK, weekIndexForHouse } from "./goals";

/**
 * Emlah'ın Takvimi — a purely derived in-game date, computed from `index`
 * (no new state needed to track "today"). Maps the existing week grouping
 * onto a real calendar: each week (HOUSES_PER_WEEK houses) spans 7 days,
 * so a house averages 7/HOUSES_PER_WEEK days — this is what turns a
 * contract's "1 ay sonra" / "3 ay sonra" clause into an actual future date
 * instead of just flavor text.
 */
const GAME_START = new Date(2026, 8, 1); // 1 Eylül 2026 — arbitrary fixed reference

function daysElapsedForIndex(index: number): number {
  return weekIndexForHouse(index) * 7 + (index % HOUSES_PER_WEEK);
}

export function gameDateForIndex(index: number): Date {
  const d = new Date(GAME_START);
  d.setDate(d.getDate() + daysElapsedForIndex(index));
  return d;
}

export function formatGameDate(date: Date): string {
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

/** Fixed appointment slots — deterministic per house so the same save always shows the same time, no extra state needed. */
const APPOINTMENT_HOURS = ["09:00", "10:15", "11:30", "13:00", "14:15", "15:30", "16:45", "18:00"];

export function gameTimeForIndex(index: number): string {
  return APPOINTMENT_HOURS[index % APPOINTMENT_HOURS.length];
}

/** Combined "1 Eylül 2026 • 14:15" label — the general clock/date readout shown across Office/Phone/Stats. */
export function formatGameDateTime(index: number): string {
  return `${formatGameDate(gameDateForIndex(index))} • ${gameTimeForIndex(index)}`;
}

export type DeliveryTermId = "hemen" | "bir-ay" | "uc-ay";

const DELIVERY_OFFSET_DAYS: Record<DeliveryTermId, number> = {
  hemen: 7,
  "bir-ay": 30,
  "uc-ay": 90,
};

/**
 * Fraction of the sale paid immediately at signing; the rest arrives when
 * delivery actually happens. "hemen" pays out in full immediately (0
 * behavior change from before this feature existed) — only the longer
 * terms introduce a real deferred portion.
 */
const DELIVERY_IMMEDIATE_SHARE: Record<DeliveryTermId, number> = {
  hemen: 1,
  "bir-ay": 0.85,
  "uc-ay": 0.7,
};

export function deliveryDateForIndex(index: number, term: DeliveryTermId): Date {
  const d = gameDateForIndex(index);
  d.setDate(d.getDate() + DELIVERY_OFFSET_DAYS[term]);
  return d;
}

/**
 * House-index checkpoint the delivery matures at — capped to the last
 * playable house so a delivery scheduled late in the game can never
 * silently vanish past the end (the same class of bug fixed earlier for
 * the personal-investment due date).
 */
export function dueIndexForDelivery(currentIndex: number, term: DeliveryTermId, maxIndex: number): number {
  const offsetDays = DELIVERY_OFFSET_DAYS[term];
  const daysPerHouse = 7 / HOUSES_PER_WEEK;
  const housesUntilDelivery = Math.round(offsetDays / daysPerHouse);
  return Math.min(currentIndex + housesUntilDelivery, maxIndex);
}

export function splitDeliveryPayment(totalAmount: number, term: DeliveryTermId): { immediateAmount: number; deferredAmount: number } {
  const share = DELIVERY_IMMEDIATE_SHARE[term];
  const immediateAmount = Math.round(totalAmount * share);
  return { immediateAmount, deferredAmount: totalAmount - immediateAmount };
}

export function deliveryTermLabel(term: DeliveryTermId): string {
  if (term === "hemen") return "Hemen (1 hafta içinde)";
  if (term === "bir-ay") return "1 ay sonra";
  return "3 ay sonra";
}
