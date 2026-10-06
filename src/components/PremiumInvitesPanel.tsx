import type { HouseResult, HouseScene, SceneOutcome } from "../types";
import { t, resolveHouseTitle, resolveHouseLocation } from "../data/language";
import { formatTL } from "../data/economy";
import { rankProgress, rankTitleDisplay } from "../data/scoring";
import LockedCard from "./LockedCard";

interface PremiumInvitesPanelProps {
  premiumHouses: HouseScene[];
  unlockedIds: string[];
  premiumResults: HouseResult[];
  onOpen: (houseId: string) => void;
  /** Toplam kazanç — kilitli davetlerin ilerleme çubuğu için. */
  earned: number;
}

function outcomeLabel(outcome: SceneOutcome): string {
  if (outcome === "sold") return `${t({ tr: "Satıldı", en: "Sold" })}`;
  if (outcome === "thinking") return `${t({ tr: "Düşünüyor", en: "Thinking" })}`;
  return `${t({ tr: "Kaybedildi", en: "Lost" })}`;
}

export default function PremiumInvitesPanel({ premiumHouses, unlockedIds, premiumResults, onOpen, earned }: PremiumInvitesPanelProps) {
  const lockedCount = premiumHouses.filter((h) => !unlockedIds.includes(h.id)).length;
  const next = rankProgress(earned);
  return (
    <div className="portfolio-panel">
      <p className="menu-empty">
        {t({
          tr: "Ününüz arttıkça daha özel müşteriler sizi doğrudan arıyor. Her davet bir kez cevaplanabilir.",
          en: "As your reputation grows, more exclusive customers call you directly. Each invite can be answered once.",
        })}
      </p>
      {premiumHouses.filter((h) => unlockedIds.includes(h.id)).map((h) => {
        const result = premiumResults.find((r) => r.houseId === h.id);

        let status: string;
        let statusClass: string;
        if (result) {
          status = outcomeLabel(result.outcome);
          statusClass = `status-${result.outcome}`;
        } else {
          status = t({ tr: "Davet bekliyor", en: "Invite pending" });
          statusClass = "status-upcoming";
        }

        return (
          <div className={`portfolio-row ${statusClass}`} key={h.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">
                {resolveHouseTitle(h)}
              </p>
              <p className="portfolio-row-location">
                {resolveHouseLocation(h)}
              </p>
            </div>
            <div className="portfolio-row-meta">
              <span className="portfolio-row-price">{formatTL(h.askingPrice)}</span>
              {!result ? (
                <button className="pixel-btn small" onClick={() => onOpen(h.id)}>
                  {t({ tr: "Görüşmeye Git", en: "Go to Meeting" })}
                </button>
              ) : (
                <span className="portfolio-row-status">{status}</span>
              )}
            </div>
          </div>
        );
      })}
      {lockedCount > 0 && (
        <LockedCard
          title={t({ tr: `${lockedCount} özel davet kilitli`, en: `${lockedCount} special invites locked` })}
          hint={
            next.nextTitle
              ? t({
                  tr: `Her rütbede yeni davetler açılır. Sıradaki: ${rankTitleDisplay(next.nextTitle)}.`,
                  en: `New invites open at every rank. Next: ${rankTitleDisplay(next.nextTitle)}.`,
                })
              : t({ tr: "Her rütbede yeni davetler açılır.", en: "New invites open at every rank." })
          }
          progress={next.nextTitle ? { current: next.current, target: next.target, label: `${formatTL(next.current)} / ${formatTL(next.target)}` } : undefined}
        />
      )}
    </div>
  );
}
