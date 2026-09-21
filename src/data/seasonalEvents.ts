import type { Localized } from "./language";
/**
 * Güncel Olaylar — a handful of scripted, date-anchored beats (unlike
 * marketNews.ts, which is random and only ever swings investment-house
 * pricing). Each fires exactly once, at the start of a specific week, as a
 * Muzaffer Bey inbox message carrying the real in-game date plus a small
 * one-off bonusEarnings nudge — the same additive pattern already used for
 * duel/mystery-shopper/investment bonuses, so it never touches
 * resolveOutcome, suspicion, discount, or any other core scoring math.
 */
export interface SeasonalEvent {
  weekIndex: number;
  headline: Localized;
  bonusEarnings: number;
}

export const seasonalEvents: SeasonalEvent[] = [
  { weekIndex: 1, headline: { tr: "Ofis yeni sezona girdi, Muzaffer Bey küçük bir prim dağıttı.", en: "The office entered the new season, Muzaffer Bey distributed a small bonus." }, bonusEarnings: 8000 },
  { weekIndex: 3, headline: { tr: "Bölgedeki emlak fuarına katıldık, birkaç yeni bağlantı kurduk.", en: "We attended the regional real estate fair, established a few new connections." }, bonusEarnings: 15000 },
  { weekIndex: 5, headline: { tr: "Kira zamları gündemde, müşteriler biraz daha temkinli — bu hafta işler ağırdan alıyor.", en: "Rent hikes are on the agenda, clients are a bit more cautious — business is taking it slow this week." }, bonusEarnings: -10000 },
  { weekIndex: 7, headline: { tr: "Yılın son çeyreği başladı, ofiste tempo arttı, ekstra mesai ödendi.", en: "The last quarter of the year started, office pace increased, overtime paid." }, bonusEarnings: 12000 },
  { weekIndex: 9, headline: { tr: "Sezonun son haftası — herkes son bir gayretle çalışıyor, moraller yüksek.", en: "The final week of the season — everyone is working with one last push, morale is high." }, bonusEarnings: 20000 },
];

export function seasonalEventForWeek(weekIndex: number): SeasonalEvent | undefined {
  return seasonalEvents.find((e) => e.weekIndex === weekIndex);
}
