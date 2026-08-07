import type { Badge, HouseResult } from "../types";

export const allBadges: Record<string, Badge> = {
  "ilk-satis": { id: "ilk-satis", title: "İlk Satış", description: "İlk evini sattın." },
  "bes-satis": { id: "bes-satis", title: "5 Satış", description: "5 ev sattın." },
  "on-satis": { id: "on-satis", title: "10 Satış", description: "10 ev sattın." },
  "seri-3": { id: "seri-3", title: "Seri Simsar", description: "Art arda 3 satış yaptın." },
  "durust-simsar": {
    id: "durust-simsar",
    title: "Dürüst Simsar",
    description: "Oyunu düşük ortalama şüpheyle tamamladın.",
  },
  "sinsi-simsar": {
    id: "sinsi-simsar",
    title: "İstanbul'un En Sinsi Emlakçısı",
    description: "Oyunu yüksek ortalama şüpheyle tamamladın.",
  },
};

export function computeStreak(results: HouseResult[]): number {
  let streak = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].outcome === "sold") streak++;
    else break;
  }
  return streak;
}

export function checkNewBadges(
  results: HouseResult[],
  isGameComplete: boolean,
  alreadyEarned: string[],
): Badge[] {
  const earned = new Set(alreadyEarned);
  const newly: Badge[] = [];
  const soldCount = results.filter((r) => r.outcome === "sold").length;
  const streak = computeStreak(results);

  const maybeAdd = (id: string) => {
    if (!earned.has(id)) {
      earned.add(id);
      newly.push(allBadges[id]);
    }
  };

  if (soldCount >= 1) maybeAdd("ilk-satis");
  if (soldCount >= 5) maybeAdd("bes-satis");
  if (soldCount >= 10) maybeAdd("on-satis");
  if (streak >= 3) maybeAdd("seri-3");

  if (isGameComplete && results.length > 0) {
    const avgSuspicion = results.reduce((s, r) => s + r.finalSuspicion, 0) / results.length;
    if (avgSuspicion <= 25) maybeAdd("durust-simsar");
    if (avgSuspicion >= 55) maybeAdd("sinsi-simsar");
  }

  return newly;
}
