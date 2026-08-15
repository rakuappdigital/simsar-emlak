import type { Badge, HouseResult } from "../types";
import { formatTL } from "../data/economy";
import { computePrestige, PRESTIGE_MAX } from "../data/scoring";
import { rivalTotalSales } from "../data/rival";
import { MedalIcon } from "./icons";

interface CareerPanelProps {
  rankTitleText: string;
  reputationText: string;
  earned: number;
  balance: number;
  ownedPerks: string[];
  badges: string[];
  allBadges: Record<string, Badge>;
  results: HouseResult[];
  tasksCompleted: number;
  chitchatBonuses: number;
  completedWeeks: number;
  investmentResults: HouseResult[];
}

export default function CareerPanel({
  rankTitleText,
  reputationText,
  earned,
  balance,
  ownedPerks,
  badges,
  allBadges,
  results,
  tasksCompleted,
  chitchatBonuses,
  completedWeeks,
  investmentResults,
}: CareerPanelProps) {
  const prestige = computePrestige(ownedPerks);
  const soldResults = results.filter((r) => r.outcome === "sold" && r.sale);
  const rivalSales = rivalTotalSales(completedWeeks);
  const investmentNet = investmentResults.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0);
  const bestSale = soldResults.reduce(
    (max, r) => (r.sale!.finalPrice > max ? r.sale!.finalPrice : max),
    0,
  );
  const cleanestSale =
    soldResults.length > 0 ? Math.min(...soldResults.map((r) => r.finalSuspicion)) : null;

  return (
    <div className="career-panel">
      <div className="career-stat-row">
        <span className="career-stat-label">Kariyer Rütbesi</span>
        <span className="career-stat-value">{rankTitleText}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">Ün</span>
        <span className="career-stat-value">{reputationText || "—"}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">Toplam Kazanç</span>
        <span className="career-stat-value">{formatTL(earned)}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">Bakiye</span>
        <span className="career-stat-value">{formatTL(balance)}</span>
      </div>

      <div className="prestige-bar">
        <span className="prestige-label">Prestij: {prestige}/{PRESTIGE_MAX}</span>
        <div className="stat-track">
          <div
            className="stat-fill prestige-fill"
            style={{ width: `${Math.min(100, (prestige / PRESTIGE_MAX) * 100)}%` }}
          />
        </div>
      </div>

      <p className="market-category-title">İstatistikler</p>
      <div className="career-stat-row">
        <span className="career-stat-label">En Yüksek Satış</span>
        <span className="career-stat-value">{bestSale > 0 ? formatTL(bestSale) : "—"}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">En Düşük Şüpheyle Satış</span>
        <span className="career-stat-value">{cleanestSale !== null ? cleanestSale.toFixed(0) : "—"}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">Tamamlanan İş Görevi</span>
        <span className="career-stat-value">{tasksCompleted}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">Yakalanan Sohbet Bonusu</span>
        <span className="career-stat-value">{chitchatBonuses}</span>
      </div>
      {completedWeeks > 0 && (
        <div className="career-stat-row">
          <span className="career-stat-label">Fırat Bey (rakip)</span>
          <span className="career-stat-value">{rivalSales} satış</span>
        </div>
      )}
      {investmentResults.length > 0 && (
        <div className="career-stat-row">
          <span className="career-stat-label">Yatırımlardan Net Kazanç</span>
          <span className={`career-stat-value ${investmentNet < 0 ? "career-stat-negative" : ""}`}>
            {formatTL(investmentNet)}
          </span>
        </div>
      )}

      <p className="market-category-title">Rozetler</p>
      {badges.length === 0 && <p className="menu-empty">Henüz rozet yok.</p>}
      {badges.length > 0 && (
        <div className="badge-popup">
          {badges.map((id) => (
            <p key={id}>
              <MedalIcon size={14} className="icon-inline" /> {allBadges[id]?.title ?? id}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
