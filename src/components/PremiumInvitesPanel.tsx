import type { HouseResult, HouseScene, SceneOutcome } from "../types";
import { t, resolveHouseTitle, resolveHouseLocation } from "../data/language";
import { formatTL } from "../data/economy";

interface PremiumInvitesPanelProps {
  premiumHouses: HouseScene[];
  unlockedIds: string[];
  premiumResults: HouseResult[];
  onOpen: (houseId: string) => void;
}

function outcomeLabel(outcome: SceneOutcome): string {
  if (outcome === "sold") return `${t({ tr: "Satıldı", en: "Sold" })} ✅`;
  if (outcome === "thinking") return `${t({ tr: "Düşünüyor", en: "Thinking" })} 🤔`;
  return `${t({ tr: "Kaybedildi", en: "Lost" })} ❌`;
}

export default function PremiumInvitesPanel({ premiumHouses, unlockedIds, premiumResults, onOpen }: PremiumInvitesPanelProps) {
  return (
    <div className="portfolio-panel">
      <p className="menu-empty">
        {t({
          tr: "Ününüz arttıkça daha özel müşteriler sizi doğrudan arıyor. Her davet bir kez cevaplanabilir.",
          en: "As your reputation grows, more exclusive customers call you directly. Each invite can be answered once.",
        })}
      </p>
      {premiumHouses.map((h) => {
        const unlocked = unlockedIds.includes(h.id);
        const result = premiumResults.find((r) => r.houseId === h.id);

        let status: string;
        let statusClass: string;
        if (result) {
          status = outcomeLabel(result.outcome);
          statusClass = `status-${result.outcome}`;
        } else if (!unlocked) {
          status = `${t({ tr: "Kilitli", en: "Locked" })} 🔒`;
          statusClass = "status-locked";
        } else {
          status = t({ tr: "Davet bekliyor", en: "Invite pending" });
          statusClass = "status-upcoming";
        }

        return (
          <div className={`portfolio-row ${statusClass}`} key={h.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">
                {unlocked ? resolveHouseTitle(h) : `??? ${t({ tr: "Özel Davet", en: "Special Invite" })}`}
              </p>
              <p className="portfolio-row-location">
                {unlocked ? resolveHouseLocation(h) : t({ tr: "Rütbe atlayınca açılır", en: "Unlocks on rank-up" })}
              </p>
            </div>
            <div className="portfolio-row-meta">
              <span className="portfolio-row-price">{unlocked ? formatTL(h.askingPrice) : "—"}</span>
              {unlocked && !result ? (
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
    </div>
  );
}
