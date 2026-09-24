import { useMemo } from "react";
import type { DailyQuestDef, WeekOutcome } from "../types";
import { formatTL } from "../data/economy";
import { rivalSalesForWeek } from "../data/rival";
import { weeklyNewsLine } from "../data/weeklyNews";
import { resolveText, t } from "../data/language";
import { generateWeekJournalEntry } from "../data/journal";
import { pickWeeklyDreamLine } from "../data/weeklyDream";
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
  const dreamLine = useMemo(() => pickWeeklyDreamLine(outcome), [outcome.weekIndex]);

  return (
    <div className="result-screen">
      <p className="week-result-title">
        {t({ tr: `Hafta ${outcome.weekIndex + 1} Değerlendirmesi`, en: `Week ${outcome.weekIndex + 1} Review` })}
      </p>
      <p className="weekly-news">{weeklyNewsLine(outcome.weekIndex, dailyQuestResult?.def.id)}</p>
      <div className="sale-summary">
        <p>
          {outcome.salesGoalMet ? "✅" : "❌"} {t({ tr: "Satış hedefi", en: "Sales goal" })}: {outcome.salesMade}/{outcome.salesTarget}
        </p>
        <p className="rival-note">
          {t({ tr: `Fırat Bey bu hafta ${rivalSales} ev sattı`, en: `Fırat Bey sold ${rivalSales} houses this week` })} —{" "}
          {outcome.salesMade > rivalSales
            ? t({ tr: "onu geçtin! 🏆", en: "you beat him! 🏆" })
            : outcome.salesMade === rivalSales
              ? t({ tr: "başa baştasınız.", en: "you're neck and neck." })
              : t({ tr: "bu hafta önde o.", en: "he's ahead this week." })}
        </p>
        <p>
          {outcome.honestyGoalMet ? "✅" : "❌"} {t({ tr: "Dürüstlük hedefi", en: "Honesty goal" })}:{" "}
          {t({ tr: "ortalama şüphe", en: "average suspicion" })} {outcome.avgSuspicion.toFixed(0)} (
          {t({ tr: "hedef", en: "goal" })}: %{outcome.maxAvgSuspicion} {t({ tr: "altı", en: "or below" })})
        </p>
        {dailyQuestResult && (
          <p>
            {dailyQuestResult.completed ? "✅" : "❌"} {t({ tr: "Özel görev", en: "Special task" })} —{" "}
            {resolveText(dailyQuestResult.def.title)}
            {dailyQuestResult.completed && ` (+${formatTL(dailyQuestResult.def.reward)})`}
          </p>
        )}
        {outcome.bonus > 0 ? (
          <p className="week-bonus">
            {t({ tr: "Hafta bonusu", en: "Week bonus" })}: +{formatTL(outcome.bonus)}
          </p>
        ) : (
          <p>{t({ tr: "Bu hafta bonus kazanılmadı.", en: "No bonus earned this week." })}</p>
        )}
      </div>

      {outcome.bestLine && (
        <p className="best-line-quote">
          <span className="best-line-label">🗣️ {t({ tr: "Haftanın cümlesi", en: "Line of the week" })}</span>
          <span className="best-line-text">{outcome.bestLine}</span>
        </p>
      )}

      <p className="journal-entry">
        <span className="journal-entry-label">📓 {t({ tr: "Emlah'ın Günlüğü", en: "Emlah's Journal" })}</span>
        <span className="journal-entry-text">{generateWeekJournalEntry(outcome)}</span>
      </p>

      <p className="journal-entry dream-entry">
        <span className="journal-entry-label">🌙 {t({ tr: "Emlah'ın Rüyası", en: "Emlah's Dream" })}</span>
        <span className="journal-entry-text">{dreamLine}</span>
      </p>

      <p className="sale-summary">
        {t({ tr: "Bakiye", en: "Balance" })}: {formatTL(balance)}
      </p>
      <button className="pixel-btn small" onClick={onOpenMarket}>
        <CartIcon size={13} className="icon-inline" /> {t({ tr: "Ofis Marketini Aç", en: "Open Office Market" })}
      </button>

      <button className="pixel-btn" onClick={onContinue}>
        {t({ tr: "Devam Et", en: "Continue" })}
      </button>
    </div>
  );
}
