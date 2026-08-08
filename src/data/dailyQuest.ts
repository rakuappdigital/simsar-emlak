import type { DailyQuestDef, HouseResult } from "../types";

export const dailyQuestDefs: DailyQuestDef[] = [
  {
    id: "discount-free",
    title: "Pazarlıksız Satış",
    description: "Bu hafta en az bir evi hiç indirim yapmadan sat.",
    reward: 35000,
  },
  {
    id: "low-suspicion",
    title: "Temiz İş",
    description: "Bu hafta en az bir evi düşük şüpheyle (20 altı) sat.",
    reward: 35000,
  },
  {
    id: "streak-2",
    title: "Seri Simsar",
    description: "Bu hafta art arda en az 2 ev sat.",
    reward: 45000,
  },
  {
    id: "high-fun",
    title: "Sohbet Ustası",
    description: "Bu hafta eğlence puanı yüksek (30+) bir görüşmeyle satış kapat.",
    reward: 40000,
  },
];

export function pickDailyQuest(weekIndex: number): DailyQuestDef {
  return dailyQuestDefs[weekIndex % dailyQuestDefs.length];
}

export function checkDailyQuest(def: DailyQuestDef, weekResults: HouseResult[]): boolean {
  switch (def.id) {
    case "discount-free":
      return weekResults.some((r) => r.outcome === "sold" && r.sale?.discountPercent === 0);
    case "low-suspicion":
      return weekResults.some((r) => r.outcome === "sold" && r.finalSuspicion <= 20);
    case "streak-2": {
      let streak = 0;
      let best = 0;
      for (const r of weekResults) {
        streak = r.outcome === "sold" ? streak + 1 : 0;
        best = Math.max(best, streak);
      }
      return best >= 2;
    }
    case "high-fun":
      return weekResults.some((r) => r.outcome === "sold" && r.finalStats.fun >= 30);
  }
}
