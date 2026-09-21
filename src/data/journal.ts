import type { WeekOutcome } from "../types";
import { getLanguage } from "./language";

/**
 * Emlah'ın Günlüğü — a one-paragraph recap auto-written purely from data
 * the game already computes for the week summary (salesMade, bestLine,
 * avgSuspicion, goals met). No new state, no persistence — just a
 * different way of presenting numbers that already exist, so replaying
 * the week's beats feels like a little story instead of a stat sheet.
 */
export function generateWeekJournalEntry(outcome: WeekOutcome): string {
  const en = getLanguage() === "en";

  const salesLine =
    outcome.salesMade === 0
      ? en
        ? "I couldn't sell a single house this week, frankly it was a bit demoralizing."
        : "Bu hafta hiç ev satamadım, açıkçası biraz moral bozucuydu."
      : outcome.salesMade === 1
        ? en
          ? "I sold only one house this week, but at least something happened."
          : "Bu hafta tek bir ev sattım ama en azından bir şey oldu."
        : en
          ? `I sold ${outcome.salesMade} houses this week, not a bad pace.`
          : `Bu hafta ${outcome.salesMade} ev sattım, fena bir tempo değildi.`;

  const goalLine = outcome.salesGoalMet
    ? en
      ? " I hit the target, Muzaffer Bey was pleased this time."
      : " Hedefi de tuttum, Muzaffer Bey bu sefer memnun kaldı."
    : en
      ? " I fell a bit short of the target, but no matter, I'll make up for it next week."
      : " Hedefin biraz altında kaldım ama önemli değil, gelecek hafta telafi ederim.";

  const honestyLine = outcome.honestyGoalMet
    ? en
      ? " My suspicion average was low, I slept peacefully at night."
      : " Şüphe ortalamam düşüktü, geceleri rahat uyudum."
    : en
      ? " My suspicion average was a bit high, some of my tricks might have been noticed."
      : " Şüphe ortalamam biraz yüksekti, bazı numaralarım fark edilmiş olabilir.";

  const bestLineText = outcome.bestLine
    ? en
      ? ` My most memorable moment was definitely this: "${outcome.bestLine}"`
      : ` En unutulmaz anım kesinlikle şuydu: "${outcome.bestLine}"`
    : "";

  return `${salesLine}${goalLine}${honestyLine}${bestLineText}`;
}
