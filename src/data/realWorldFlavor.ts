import { resolveText, type Localized } from "./language";
/**
 * "Oyun senin gerçek saatini biliyor" — a rare fourth-wall moment based on
 * the player's actual real-world clock (not the in-game calendar). Fires at
 * most once per session (see App.tsx's realWorldFlavorShown ref) so it stays
 * a surprise instead of becoming a repeated gimmick. Pure flavor: an inbox
 * message from Muzaffer Bey, zero stat/economy effect.
 */
const lateNightLines = [
  { tr: "Bu saatte hâlâ ev mi bakıyorsun Emlah, git yat artık.", en: "Still looking at houses at this hour Emlah, go to sleep already." },
  { tr: "Gece yarısını geçti, ekranın karşısında ne işin var senin?", en: "It past midnight, what are you doing in front of the screen?" },
  { tr: "Uykusuzluk bu işin bir parçası galiba, seni de yakaladı demek.", en: "Insomnia must be part of this job, caught you too I see." },
];

const earlyMorningLines = [
  { tr: "Erkenciymişsin be Emlah, daha güneş yeni doğdu.", en: "You're an early bird Emlah, the sun just rose." },
  { tr: "Sabahın bu saatinde çalışkanlığına diyecek yok.", en: "Can't say anything against your diligence at this hour of the morning." },
];

const fridayLines = [
  { tr: "Cuma bugün, herkes erken çıkmak istiyor ama bizde mesai bitmiyor.", en: "It's Friday today, everyone wants to leave early but our shift never ends." },
  { tr: "Hafta sonu yaklaşıyor, son bir gayret Emlah.", en: "The weekend is approaching, one final push Emlah." },
];

const weekendLines = [
  { tr: "Hafta sonu bile çalışıyorsun, bu azim takdire şayan.", en: "You're working even on the weekend, this perseverance is commendable." },
  { tr: "Bugün tatil ama sen yine buradasın, aferin sana.", en: "Today is a holiday but here you are again, good for you." },
];

function candidatesFor(now: Date): Localized[] {
  const hour = now.getHours();
  const day = now.getDay();
  const candidates: Localized[] = [];
  if (hour >= 0 && hour < 5) candidates.push(...lateNightLines);
  else if (hour >= 5 && hour < 8) candidates.push(...earlyMorningLines);
  if (day === 5) candidates.push(...fridayLines);
  if (day === 0 || day === 6) candidates.push(...weekendLines);
  return candidates;
}

export const REAL_WORLD_FLAVOR_CHANCE = 0.2;

/** Null when the real-world clock doesn't currently match any flavor window. */
export function pickRealWorldFlavorLine(now: Date = new Date()): string | null {
  const candidates = candidatesFor(now);
  if (candidates.length === 0) return null;
  return resolveText(candidates[Math.floor(Math.random() * candidates.length)]);
}
