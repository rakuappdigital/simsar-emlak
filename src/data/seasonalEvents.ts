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
  headline: string;
  bonusEarnings: number;
}

export const seasonalEvents: SeasonalEvent[] = [
  { weekIndex: 1, headline: "Ofis yeni sezona girdi, Muzaffer Bey küçük bir prim dağıttı.", bonusEarnings: 8000 },
  { weekIndex: 3, headline: "Bölgedeki emlak fuarına katıldık, birkaç yeni bağlantı kurduk.", bonusEarnings: 15000 },
  { weekIndex: 5, headline: "Kira zamları gündemde, müşteriler biraz daha temkinli — bu hafta işler ağırdan alıyor.", bonusEarnings: -10000 },
  { weekIndex: 7, headline: "Yılın son çeyreği başladı, ofiste tempo arttı, ekstra mesai ödendi.", bonusEarnings: 12000 },
  { weekIndex: 9, headline: "Sezonun son haftası — herkes son bir gayretle çalışıyor, moraller yüksek.", bonusEarnings: 20000 },
];

export function seasonalEventForWeek(weekIndex: number): SeasonalEvent | undefined {
  return seasonalEvents.find((e) => e.weekIndex === weekIndex);
}
