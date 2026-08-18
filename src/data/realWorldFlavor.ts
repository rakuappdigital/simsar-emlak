/**
 * "Oyun senin gerçek saatini biliyor" — a rare fourth-wall moment based on
 * the player's actual real-world clock (not the in-game calendar). Fires at
 * most once per session (see App.tsx's realWorldFlavorShown ref) so it stays
 * a surprise instead of becoming a repeated gimmick. Pure flavor: an inbox
 * message from Muzaffer Bey, zero stat/economy effect.
 */
const lateNightLines = [
  "Bu saatte hâlâ ev mi bakıyorsun Emlah, git yat artık.",
  "Gece yarısını geçti, ekranın karşısında ne işin var senin?",
  "Uykusuzluk bu işin bir parçası galiba, seni de yakaladı demek.",
];

const earlyMorningLines = [
  "Erkenciymişsin be Emlah, daha güneş yeni doğdu.",
  "Sabahın bu saatinde çalışkanlığına diyecek yok.",
];

const fridayLines = [
  "Cuma bugün, herkes erken çıkmak istiyor ama bizde mesai bitmiyor.",
  "Hafta sonu yaklaşıyor, son bir gayret Emlah.",
];

const weekendLines = [
  "Hafta sonu bile çalışıyorsun, bu azim takdire şayan.",
  "Bugün tatil ama sen yine buradasın, aferin sana.",
];

function candidatesFor(now: Date): string[] {
  const hour = now.getHours();
  const day = now.getDay();
  const candidates: string[] = [];
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
  return candidates[Math.floor(Math.random() * candidates.length)];
}
