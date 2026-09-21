import { resolveText, type Localized } from "./language";
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
  { tr: "Aslında ben bir emlak inceleme sitesi için gizli müşteriydim — dürüstlüğünüz gerçekten fark edildi, küçük bir teşekkür yolda!", en: "Actually, I was a mystery shopper for a real estate review site — your honesty was truly noticed, a small thank you is on the way!" },
  { tr: "İtiraf edeyim, sizi test ediyordum aslında — bu kadar şeffaf bir emlakçı az bulunur, bir jest yapmak istedim.", en: "I must confess, I was actually testing you — an agent this transparent is rare, wanted to make a gesture." },
];

const sneakyReveals = [
  { tr: "Aslında bir emlak inceleme sitesi için gizli müşteriydim, açıkçası bazı cevaplarınız pek şeffaf değildi — bunu rapor etmek zorundayım.", en: "Actually, I was a mystery shopper for a real estate review site, frankly some of your answers weren't very transparent — I have to report this." },
  { tr: "İtiraf edeyim, sizi test ediyordum — biraz fazla iyimser bir satış taktiği kullandınız, bu küçük bir notla sonuçlandı.", en: "I must confess, I was testing you — you used a bit overly optimistic sales tactic, resulting in this small note." },
];

const neutralReveals = [
  { tr: "Aslında bir emlak inceleme sitesi için gizli müşteriydim — ortalama bir görüşmeydi, ne çok iyi ne çok kötü, öylece not düşüyorum.", en: "Actually, I was a mystery shopper for a real estate review site — it was an average meeting, neither too good nor too bad, making a note of it." },
];

// "Aynı Yüzler, Farklı Bağlamlar" — occasionally the reveal namedrops a real
// past contact (see App.tsx's contactedCustomers), the same "small world"
// trick as echoNetwork.ts, just from the Gizli Müşteri's mouth instead of a
// new customer's. No cast-identity is actually shared (the pool avoids
// reusing characters on purpose) — this is a claimed connection in the
// text, exactly like echoNetwork's namedrops.
const honestRevealsWithName = [
  { tr: "Aslında ben bir emlak inceleme sitesi için gizli müşteriydim — {isim} sizi tavsiye etmişti, haklıymış, gerçekten dürüstsünüz.", en: "Actually, I was a mystery shopper for a real estate review site — your honesty was truly noticed, a small thank you is on the way!" },
];
const sneakyRevealsWithName = [
  { tr: "Aslında bir emlak inceleme sitesi için gizli müşteriydim — {isim} sizi tavsiye etmişti ama açıkçası bazı cevaplarınız pek şeffaf değildi.", en: "Actually, I was a mystery shopper for a real estate review site, frankly some of your answers weren't very transparent — I have to report this." },
];

const NAME_REVEAL_CHANCE = 0.3;

function pick(arr: Localized[]): string {
  return resolveText(arr[Math.floor(Math.random() * arr.length)]);
}

export function pickMysteryShopperReveal(verdict: MysteryShopperVerdict, pastContactName?: string): string {
  if (pastContactName && Math.random() < NAME_REVEAL_CHANCE) {
    if (verdict === "honest") return pick(honestRevealsWithName).replace("{isim}", pastContactName);
    if (verdict === "sneaky") return pick(sneakyRevealsWithName).replace("{isim}", pastContactName);
  }
  if (verdict === "honest") return pick(honestReveals);
  if (verdict === "sneaky") return pick(sneakyReveals);
  return pick(neutralReveals);
}
