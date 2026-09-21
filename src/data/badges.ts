import type { Badge, HouseResult } from "../types";

const HONESTY_THRESHOLD = 20;

export const allBadges: Record<string, Badge> = {
  "ilk-satis": { id: "ilk-satis", title: { tr: "İlk Satış", en: "First Sale" }, description: { tr: "İlk evini sattın.", en: "You sold your first home." } },
  "bes-satis": { id: "bes-satis", title: { tr: "5 Satış", en: "5 Sales" }, description: { tr: "5 ev sattın.", en: "You sold 5 homes." } },
  "on-satis": { id: "on-satis", title: { tr: "10 Satış", en: "10 Sales" }, description: { tr: "10 ev sattın.", en: "You sold 10 homes." } },
  "seri-3": { id: "seri-3", title: { tr: "Seri Simsar", en: "Streak Realtor" }, description: { tr: "Art arda 3 satış yaptın.", en: "You made 3 sales in a row." } },
  "durust-seri": {
    id: "durust-seri",
    title: { tr: "Dürüstlük Serisi", en: "Honesty Streak" },
    description: { tr: "Art arda 3 evi düşük şüpheyle kapattın.", en: "You closed 3 homes in a row with low suspicion." },
  },
  "durust-simsar": {
    id: "durust-simsar",
    title: { tr: "Dürüst Simsar", en: "Honest Realtor" },
    description: { tr: "Oyunu düşük ortalama şüpheyle tamamladın.", en: "You completed the game with a low average suspicion." },
  },
  "sinsi-simsar": {
    id: "sinsi-simsar",
    title: { tr: "İstanbul'un En Sinsi Emlakçısı", en: "Istanbul's Sneakiest Realtor" },
    description: { tr: "Oyunu yüksek ortalama şüpheyle tamamladın.", en: "You completed the game with a high average suspicion." },
  },
  "gorev-ustasi": {
    id: "gorev-ustasi",
    title: { tr: "Görev Ustası", en: "Task Master" },
    description: { tr: "10 ofis görevi tamamladın.", en: "You have completed 10 office tasks." },
  },
  "sohbet-ustasi": {
    id: "sohbet-ustasi",
    title: { tr: "Sohbet Ustası", en: "Chat Master" },
    description: { tr: "5 sohbette bonus cevabı yakaladın.", en: "You caught a bonus answer in 5 chats." },
  },
  "yatirimci-5": {
    id: "yatirimci-5",
    title: { tr: "Emlak Yatırımcısı", en: "Real Estate Investor" },
    description: { tr: "5 yatırım evini kendi adına sattın.", en: "You sold 5 investment houses on your behalf." },
  },
  "yatirimci-zarar-yok-3": {
    id: "yatirimci-zarar-yok-3",
    title: { tr: "Kayıpsız Seri", en: "Flawless Streak" },
    description: { tr: "Art arda 3 yatırım evini zarar etmeden sattın.", en: "You sold 3 investment houses in a row without loss." },
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

export function computeHonestyStreak(results: HouseResult[]): number {
  let streak = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].finalSuspicion <= HONESTY_THRESHOLD) streak++;
    else break;
  }
  return streak;
}

export function checkNewBadges(
  results: HouseResult[],
  isGameComplete: boolean,
  alreadyEarned: string[],
  extra: { tasksCompleted: number; chitchatBonuses: number },
): Badge[] {
  const earned = new Set(alreadyEarned);
  const newly: Badge[] = [];
  const soldCount = results.filter((r) => r.outcome === "sold").length;
  const streak = computeStreak(results);
  const honestyStreak = computeHonestyStreak(results);

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
  if (honestyStreak >= 3) maybeAdd("durust-seri");
  if (extra.tasksCompleted >= 10) maybeAdd("gorev-ustasi");
  if (extra.chitchatBonuses >= 5) maybeAdd("sohbet-ustasi");

  if (isGameComplete && results.length > 0) {
    const avgSuspicion = results.reduce((s, r) => s + r.finalSuspicion, 0) / results.length;
    if (avgSuspicion <= 25) maybeAdd("durust-simsar");
    if (avgSuspicion >= 55) maybeAdd("sinsi-simsar");
  }

  return newly;
}

/** Streak of consecutive investment-house sale attempts that closed "sold" with a non-negative profit — breaks on any loss, thinking, or lost attempt. */
export function computeInvestmentNoLossStreak(investmentResults: HouseResult[]): number {
  let streak = 0;
  for (let i = investmentResults.length - 1; i >= 0; i--) {
    const r = investmentResults[i];
    if (r.outcome === "sold" && (r.sale?.commission ?? 0) >= 0) streak++;
    else break;
  }
  return streak;
}

/** Separate from checkNewBadges (which only ever looks at the main house pool) so investment-house sales never touch that call site. */
export function checkNewInvestmentBadges(investmentResults: HouseResult[], alreadyEarned: string[]): Badge[] {
  const earned = new Set(alreadyEarned);
  const newly: Badge[] = [];
  const maybeAdd = (id: string) => {
    if (!earned.has(id)) {
      earned.add(id);
      newly.push(allBadges[id]);
    }
  };

  const soldCount = investmentResults.filter((r) => r.outcome === "sold").length;
  if (soldCount >= 5) maybeAdd("yatirimci-5");
  if (computeInvestmentNoLossStreak(investmentResults) >= 3) maybeAdd("yatirimci-zarar-yok-3");

  return newly;
}
