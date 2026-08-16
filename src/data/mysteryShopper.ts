/**
 * Gizli Müşteri — a very rare, silent tag on a random main-house visit
 * (never announced up front, that's the whole point of the surprise).
 * Once that house's outcome resolves, a reveal message + a small one-off
 * bonusEarnings adjustment fires based on how honest the visit was —
 * purely additive/subtractive on bonusEarnings, never touches suspicion,
 * reputation, or any past result's stored data.
 */
export const MYSTERY_SHOPPER_CHANCE = 0.05;

// Mirrors the honest/sneaky thresholds used for ending calculation
// (endings.ts) so "honest" here means the same thing it does everywhere else.
const HONEST_THRESHOLD = 25;
const SNEAKY_THRESHOLD = 55;

export const MYSTERY_SHOPPER_HONEST_BONUS = 20000;
export const MYSTERY_SHOPPER_SNEAKY_PENALTY = 10000;

export type MysteryShopperVerdict = "honest" | "sneaky" | "neutral";

export function mysteryShopperVerdict(finalSuspicion: number): MysteryShopperVerdict {
  if (finalSuspicion <= HONEST_THRESHOLD) return "honest";
  if (finalSuspicion >= SNEAKY_THRESHOLD) return "sneaky";
  return "neutral";
}

const honestReveals = [
  "Aslında ben bir emlak inceleme sitesi için gizli müşteriydim — dürüstlüğünüz gerçekten fark edildi, küçük bir teşekkür yolda!",
  "İtiraf edeyim, sizi test ediyordum aslında — bu kadar şeffaf bir emlakçı az bulunur, bir jest yapmak istedim.",
];

const sneakyReveals = [
  "Aslında bir emlak inceleme sitesi için gizli müşteriydim, açıkçası bazı cevaplarınız pek şeffaf değildi — bunu rapor etmek zorundayım.",
  "İtiraf edeyim, sizi test ediyordum — biraz fazla iyimser bir satış taktiği kullandınız, bu küçük bir notla sonuçlandı.",
];

const neutralReveals = [
  "Aslında bir emlak inceleme sitesi için gizli müşteriydim — ortalama bir görüşmeydi, ne çok iyi ne çok kötü, öylece not düşüyorum.",
];

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickMysteryShopperReveal(verdict: MysteryShopperVerdict): string {
  if (verdict === "honest") return pick(honestReveals);
  if (verdict === "sneaky") return pick(sneakyReveals);
  return pick(neutralReveals);
}
