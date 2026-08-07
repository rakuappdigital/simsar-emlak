import type { WeekOutcome } from "../types";
import { formatTL } from "../data/economy";
import { perks } from "../data/perks";

interface WeekResultProps {
  outcome: WeekOutcome;
  balance: number;
  ownedPerks: string[];
  onBuyPerk: (perkId: string) => void;
  onContinue: () => void;
}

export default function WeekResult({ outcome, balance, ownedPerks, onBuyPerk, onContinue }: WeekResultProps) {
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

      <div className="perk-shop">
        <p className="perk-shop-title">Bakiye: {formatTL(balance)}</p>
        {perks.map((perk) => {
          const owned = ownedPerks.includes(perk.id);
          return (
            <div className="perk-row" key={perk.id}>
              <div className="perk-info">
                <p className="perk-title">{perk.title}</p>
                <p className="perk-description">{perk.description}</p>
              </div>
              <button
                className="pixel-btn small"
                disabled={owned || balance < perk.cost}
                onClick={() => onBuyPerk(perk.id)}
              >
                {owned ? "Alındı ✓" : formatTL(perk.cost)}
              </button>
            </div>
          );
        })}
      </div>

      <button className="pixel-btn" onClick={onContinue}>
        Devam Et
      </button>
    </div>
  );
}
