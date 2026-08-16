// Asking prices across houses.ts/premiumHouses.ts were scaled up 7.5x to
// look like realistic present-day Istanbul listings; this rate is divided
// by the same 7.5 (0.03 -> 0.004) so actual commission amounts — and every
// threshold derived from them (rank, RICH_THRESHOLD, badges, market
// prices) — land exactly where they did before. Only the displayed sticker
// price changed, not the economy's pacing.
export const COMMISSION_RATE = 0.004;

export const formatTL = (amount: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(amount);
