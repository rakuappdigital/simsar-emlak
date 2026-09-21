import type { DailyQuestDef, HouseResult, WeekOutcome } from "../types";
import { resolveText } from "./language";

export const dailyQuestDefs: DailyQuestDef[] = [
  {
    id: "discount-free",
    title: { tr: "Pazarlıksız Satış", en: "No-Discount Sale" },
    description: { tr: "Bu hafta en az bir evi hiç indirim yapmadan sat.", en: "Sell at least one home this week without any discount." },
    reward: 35000,
  },
  {
    id: "low-suspicion",
    title: { tr: "Temiz İş", en: "Clean Job" },
    description: { tr: "Bu hafta en az bir evi düşük şüpheyle (20 altı) sat.", en: "Sell at least one home this week with low suspicion (under 20)." },
    reward: 35000,
  },
  {
    id: "streak-2",
    title: { tr: "Seri Simsar", en: "Streak Realtor" },
    description: { tr: "Bu hafta art arda en az 2 ev sat.", en: "Sell at least 2 homes in a row this week." },
    reward: 45000,
  },
  {
    id: "high-fun",
    title: { tr: "Sohbet Ustası", en: "Chat Master" },
    description: { tr: "Bu hafta eğlence puanı yüksek (30+) bir görüşmeyle satış kapat.", en: "Close a sale this week with a high fun score (30+) meeting." },
    reward: 40000,
  },
];

export function pickDailyQuest(weekIndex: number): DailyQuestDef {
  return dailyQuestDefs[weekIndex % dailyQuestDefs.length];
}

const RECOVERY_BONUS = 15000;

/**
 * A small, capped reward bump — not a new discount/multiplier system, just
 * one flat extra amount — when the last two completed weeks both missed
 * their sales target. Muzaffer's "annoyed" mood (see introFlavor.ts)
 * already tells the player something is off; this gives that streak of bad
 * weeks an actual recovery lever instead of only ever being narrative.
 */
export function applyRecoveryBonus(quest: DailyQuestDef, weekOutcomes: WeekOutcome[]): DailyQuestDef {
  const lastTwo = weekOutcomes.slice(-2);
  const bothMissed = lastTwo.length === 2 && lastTwo.every((w) => !w.salesGoalMet);
  if (!bothMissed) return quest;
  return {
    ...quest,
    reward: quest.reward + RECOVERY_BONUS,
    description: `${resolveText(quest.description)} (Toparlanma bonusu: +${RECOVERY_BONUS.toLocaleString("tr-TR")}₺)`,
  };
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
