import type { WeekOutcome } from "../types";
import { formatTL } from "../data/economy";

interface WeekResultProps {
  outcome: WeekOutcome;
  onContinue: () => void;
}

export default function WeekResult({ outcome, onContinue }: WeekResultProps) {
  return (
    <div className="result-screen">
      <p className="week-result-title">Hafta {outcome.weekIndex + 1} Değerlendirmesi</p>
      <div className="sale-summary">
        <p>
          {outcome.salesGoalMet ? "✅" : "❌"} Satış hedefi: {outcome.salesMade}/{outcome.salesTarget}
        </p>
        <p>
          {outcome.honestyGoalMet ? "✅" : "❌"} Dürüstlük hedefi: ortalama şüphe {outcome.avgSuspicion.toFixed(0)}
          {" "}(hedef: %{outcome.maxAvgSuspicion} altı)
        </p>
        {outcome.bonus > 0 ? (
          <p className="week-bonus">Hafta bonusu: +{formatTL(outcome.bonus)}</p>
        ) : (
          <p>Bu hafta bonus kazanılmadı.</p>
        )}
      </div>
      <button className="pixel-btn" onClick={onContinue}>
        Devam Et
      </button>
    </div>
  );
}
