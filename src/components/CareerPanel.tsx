import type { Badge } from "../types";
import { formatTL } from "../data/economy";
import { computePrestige, PRESTIGE_MAX } from "../data/scoring";

interface CareerPanelProps {
  rankTitleText: string;
  reputationText: string;
  earned: number;
  balance: number;
  ownedPerks: string[];
  badges: string[];
  allBadges: Record<string, Badge>;
}

export default function CareerPanel({
  rankTitleText,
  reputationText,
  earned,
  balance,
  ownedPerks,
  badges,
  allBadges,
}: CareerPanelProps) {
  const prestige = computePrestige(ownedPerks);

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

      <p className="market-category-title">Rozetler</p>
      {badges.length === 0 && <p className="menu-empty">Henüz rozet yok.</p>}
      {badges.length > 0 && (
        <div className="badge-popup">
          {badges.map((id) => (
            <p key={id}>🏅 {allBadges[id]?.title ?? id}</p>
          ))}
        </div>
      )}
    </div>
  );
}
