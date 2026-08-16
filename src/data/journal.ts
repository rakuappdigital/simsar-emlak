import type { WeekOutcome } from "../types";

/**
 * Emlah'ın Günlüğü — a one-paragraph recap auto-written purely from data
 * the game already computes for the week summary (salesMade, bestLine,
 * avgSuspicion, goals met). No new state, no persistence — just a
 * different way of presenting numbers that already exist, so replaying
 * the week's beats feels like a little story instead of a stat sheet.
 */
export function generateWeekJournalEntry(outcome: WeekOutcome): string {
  const salesLine =
    outcome.salesMade === 0
      ? "Bu hafta hiç ev satamadım, açıkçası biraz moral bozucuydu."
      : outcome.salesMade === 1
        ? "Bu hafta tek bir ev sattım ama en azından bir şey oldu."
        : `Bu hafta ${outcome.salesMade} ev sattım, fena bir tempo değildi.`;

  const goalLine = outcome.salesGoalMet
    ? " Hedefi de tuttum, Muzaffer Bey bu sefer memnun kaldı."
    : " Hedefin biraz altında kaldım ama önemli değil, gelecek hafta telafi ederim.";

  const honestyLine = outcome.honestyGoalMet
    ? " Şüphe ortalamam düşüktü, geceleri rahat uyudum."
    : " Şüphe ortalamam biraz yüksekti, bazı numaralarım fark edilmiş olabilir.";

  const bestLineText = outcome.bestLine
    ? ` En unutulmaz anım kesinlikle şuydu: "${outcome.bestLine}"`
    : "";

  return `${salesLine}${goalLine}${honestyLine}${bestLineText}`;
}
