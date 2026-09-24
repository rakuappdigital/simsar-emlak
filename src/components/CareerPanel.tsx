import type { Badge, HouseResult } from "../types";
import { formatTL } from "../data/economy";
import { computePrestige, PRESTIGE_MAX, rankTitleDisplay } from "../data/scoring";
import { rivalLadder, activeRivalFor } from "../data/rivalLadder";
import { MedalIcon } from "./icons";
import { resolveText, t } from "../data/language";
import { showLeaderboard } from "../data/gameCenter";

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
  investmentResults: HouseResult[];
  defeatedRivalIds: string[];
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
  investmentResults,
  defeatedRivalIds,
}: CareerPanelProps) {
  const prestige = computePrestige(ownedPerks);
  const soldResults = results.filter((r) => r.outcome === "sold" && r.sale);
  const soldCount = soldResults.length;
  const activeRival = activeRivalFor(defeatedRivalIds);
  const investmentNet = investmentResults.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0);
  const bestSale = soldResults.reduce(
    (max, r) => (r.sale!.finalPrice > max ? r.sale!.finalPrice : max),
    0,
  );
  const cleanestSale =
    soldResults.length > 0 ? Math.min(...soldResults.map((r) => r.finalSuspicion)) : null;

  return (
    <div className="career-panel">
      <button className="pixel-btn small" onClick={showLeaderboard}>
        🏆 {t({ tr: "Liderlik Tablosu", en: "Leaderboard" })}
      </button>
      <div className="career-stat-row">
        <span className="career-stat-label">{t({ tr: "Kariyer Rütbesi", en: "Career Rank" })}</span>
        <span className="career-stat-value">{rankTitleDisplay(rankTitleText)}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">{t({ tr: "Ün", en: "Reputation" })}</span>
        <span className="career-stat-value">{reputationText || "—"}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">{t({ tr: "Toplam Kazanç", en: "Total Earnings" })}</span>
        <span className="career-stat-value">{formatTL(earned)}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">{t({ tr: "Bakiye", en: "Balance" })}</span>
        <span className="career-stat-value">{formatTL(balance)}</span>
      </div>

      <div className="prestige-bar">
        <span className="prestige-label">{t({ tr: "Prestij", en: "Prestige" })}: {prestige}/{PRESTIGE_MAX}</span>
        <div className="stat-track">
          <div
            className="stat-fill prestige-fill"
            style={{ width: `${Math.min(100, (prestige / PRESTIGE_MAX) * 100)}%` }}
          />
        </div>
      </div>

      <p className="market-category-title">{t({ tr: "İstatistikler", en: "Statistics" })}</p>
      <div className="career-stat-row">
        <span className="career-stat-label">{t({ tr: "En Yüksek Satış", en: "Highest Sale" })}</span>
        <span className="career-stat-value">{bestSale > 0 ? formatTL(bestSale) : "—"}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">{t({ tr: "En Düşük Şüpheyle Satış", en: "Lowest-Suspicion Sale" })}</span>
        <span className="career-stat-value">{cleanestSale !== null ? cleanestSale.toFixed(0) : "—"}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">{t({ tr: "Tamamlanan İş Görevi", en: "Office Tasks Completed" })}</span>
        <span className="career-stat-value">{tasksCompleted}</span>
      </div>
      <div className="career-stat-row">
        <span className="career-stat-label">{t({ tr: "Yakalanan Sohbet Bonusu", en: "Chitchat Bonuses Earned" })}</span>
        <span className="career-stat-value">{chitchatBonuses}</span>
      </div>
      <p className="market-category-title">{t({ tr: "Şehrin Kurtları", en: "Wolves of the City" })}</p>
      {rivalLadder.map((rival, i) => {
        const defeated = defeatedRivalIds.includes(rival.id);
        const isActive = !defeated && activeRival.id === rival.id;
        return (
          <div className="career-stat-row rival-ladder-row" key={rival.id}>
            <span className="career-stat-label">
              {i + 1}. {rival.name} <span className="rival-ladder-title">— {resolveText(rival.title)}</span>
            </span>
            <span className="career-stat-value">
              {defeated ? `✅ ${t({ tr: "Geçildi", en: "Passed" })}` : isActive ? `${soldCount}/${rival.threshold}` : "🔒"}
            </span>
          </div>
        );
      })}

      {investmentResults.length > 0 && (
        <div className="career-stat-row">
          <span className="career-stat-label">{t({ tr: "Yatırımlardan Net Kazanç", en: "Net Investment Profit" })}</span>
          <span className={`career-stat-value ${investmentNet < 0 ? "career-stat-negative" : ""}`}>
            {formatTL(investmentNet)}
          </span>
        </div>
      )}

      <p className="market-category-title">{t({ tr: "Rozetler", en: "Badges" })}</p>
      {badges.length === 0 && <p className="menu-empty">{t({ tr: "Henüz rozet yok.", en: "No badges yet." })}</p>}
      {badges.length > 0 && (
        <div className="badge-popup">
          {badges.map((id) => (
            <p key={id}>
              <MedalIcon size={14} className="icon-inline" /> {allBadges[id] ? resolveText(allBadges[id].title) : id}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
