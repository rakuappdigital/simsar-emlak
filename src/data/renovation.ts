/**
 * Tadilat — every investment house is rolled a random condition when
 * bought (not authored per-house, so the same listing can be a fixer-upper
 * one game and move-in-ready the next). The player can then spend money
 * on one of three renovation levels before reselling: it always raises
 * the resale ceiling a bit, but only fully pays off if it actually
 * matches how much work the house needed — an under-renovated "kötü"
 * house makes the buyer negotiate harder (and says so), matching the
 * exact same additive-toughness pattern already used for market news.
 */
export type HouseCondition = "iyi" | "orta" | "kotu";
export type RenovationLevel = "yok" | "basit" | "orta" | "yenileme";

const conditionSeverity: Record<HouseCondition, number> = { iyi: 0, orta: 1, kotu: 2 };
const renovationRank: Record<RenovationLevel, number> = { yok: 0, basit: 1, orta: 2, yenileme: 3 };

export const conditionLabel: Record<HouseCondition, string> = {
  iyi: "İyi Durumda",
  orta: "Orta Halli",
  kotu: "Bakım Gerekiyor",
};

export interface RenovationOption {
  level: RenovationLevel;
  label: string;
  /** Fraction of the purchase price. */
  costRate: number;
  /** Fraction added to the resale price ceiling, regardless of condition. */
  priceBoostRate: number;
}

export const renovationOptions: RenovationOption[] = [
  { level: "basit", label: "Basit Tadilat", costRate: 0.04, priceBoostRate: 0.06 },
  { level: "orta", label: "Orta Ölçekli Tadilat", costRate: 0.1, priceBoostRate: 0.14 },
  { level: "yenileme", label: "Yenileme", costRate: 0.18, priceBoostRate: 0.25 },
];

/** Rolled once, at purchase time — roughly a third each. */
export function rollCondition(): HouseCondition {
  const r = Math.random();
  if (r < 1 / 3) return "iyi";
  if (r < 2 / 3) return "orta";
  return "kotu";
}

/** How many renovation "steps" short of what the condition really needed — 0 means no penalty. */
export function renovationGap(condition: HouseCondition, level: RenovationLevel): number {
  return Math.max(0, conditionSeverity[condition] - renovationRank[level]);
}

/** Extra resale toughness per unmet renovation step — same shape/scale as NEWS_RESALE_TOUGHNESS_FACTOR. */
export const RENOVATION_GAP_TOUGHNESS = 0.06;

export function renovationPriceBoost(level: RenovationLevel): number {
  if (level === "yok") return 0;
  return renovationOptions.find((o) => o.level === level)?.priceBoostRate ?? 0;
}

export function renovationCost(level: RenovationLevel, purchasePrice: number): number {
  const option = renovationOptions.find((o) => o.level === level);
  return option ? Math.round(purchasePrice * option.costRate) : 0;
}

const conditionWarningThoughts = [
  "(içinden) Bu evi yeterince toparlamadım, alıcı fark edecektir.",
  "(içinden) Tadilat konusunda biraz eli sıkı davrandım, bu şimdi karşıma çıkabilir.",
];

const conditionWarningLines = [
  "(çevreye bakınır) Açıkçası burada epey eksik var, bu fiyatta ısrar edeceğim.",
  "(duvarlara dokunur) Bu haliyle tam istediğim gibi değil, pazarlığa açığım demeyeceğim.",
  "(kaşlarını çatar) Beklediğimden bakımsız, bunu fiyata yansıtmam lazım.",
];

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickConditionWarningThought(): string {
  return pick(conditionWarningThoughts);
}

export function pickConditionWarningLine(): string {
  return pick(conditionWarningLines);
}
