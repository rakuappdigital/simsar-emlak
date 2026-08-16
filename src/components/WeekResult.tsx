import type { DailyQuestDef, WeekOutcome } from "../types";
import { formatTL } from "../data/economy";
import { rivalSalesForWeek } from "../data/rival";
import { weeklyNewsLine } from "../data/weeklyNews";
import { generateWeekJournalEntry } from "../data/journal";
import { CartIcon } from "./icons";

interface WeekResultProps {
  outcome: WeekOutcome;
  balance: number;
  dailyQuestResult: { def: DailyQuestDef; completed: boolean } | null;
  onOpenMarket: () => void;
  onContinue: () => void;
}

export default function WeekResult({ outcome, balance, dailyQuestResult, onOpenMarket, onContinue }: WeekResultProps) {
  const rivalSales = rivalSalesForWeek(outcome.weekIndex);
  return (
    <div className="result-screen">
      <p className="week-result-title">Hafta {outcome.weekIndex + 1} Değerlendirmesi</p>
      <p className="weekly-news">{weeklyNewsLine(outcome.weekIndex, dailyQuestResult?.def.id)}</p>
      <div className="sale-summary">
        <p>
          {outcome.salesGoalMet ? "✅" : "❌"} Satış hedefi: {outcome.salesMade}/{outcome.salesTarget}
        </p>
        <p className="rival-note">
          Fırat Bey bu hafta {rivalSales} ev sattı —{" "}
          {outcome.salesMade > rivalSales
            ? "onu geçtin! 🏆"
            : outcome.salesMade === rivalSales
              ? "başa baştasınız."
              : "bu hafta önde o."}
        </p>
        <p>
          {outcome.honestyGoalMet ? "✅" : "❌"} Dürüstlük hedefi: ortalama şüphe {outcome.avgSuspicion.toFixed(0)}
          {" "}(hedef: %{outcome.maxAvgSuspicion} altı)
        </p>
        {dailyQuestResult && (
          <p>
            {dailyQuestResult.completed ? "✅" : "❌"} Özel görev — {dailyQuestResult.def.title}
            {dailyQuestResult.completed && ` (+${formatTL(dailyQuestResult.def.reward)})`}
          </p>
        )}
        {outcome.bonus > 0 ? (
          <p className="week-bonus">Hafta bonusu: +{formatTL(outcome.bonus)}</p>
        ) : (
          <p>Bu hafta bonus kazanılmadı.</p>
        )}
      </div>

      {outcome.bestLine && (
        <p className="best-line-quote">
          <span className="best-line-label">🗣️ Haftanın cümlesi</span>
          <span className="best-line-text">{outcome.bestLine}</span>
        </p>
      )}

      <p className="journal-entry">
        <span className="journal-entry-label">📓 Emlah'ın Günlüğü</span>
        <span className="journal-entry-text">{generateWeekJournalEntry(outcome)}</span>
      </p>

      <p className="sale-summary">Bakiye: {formatTL(balance)}</p>
      <button className="pixel-btn small" onClick={onOpenMarket}>
        <CartIcon size={13} className="icon-inline" /> Ofis Marketini Aç
      </button>

      <button className="pixel-btn" onClick={onContinue}>
        Devam Et
      </button>
    </div>
  );
}
