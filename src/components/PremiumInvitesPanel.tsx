import type { HouseResult, HouseScene, SceneOutcome } from "../types";
import { formatTL } from "../data/economy";

interface PremiumInvitesPanelProps {
  premiumHouses: HouseScene[];
  unlockedIds: string[];
  premiumResults: HouseResult[];
  onOpen: (houseId: string) => void;
}

const outcomeLabel: Record<SceneOutcome, string> = {
  sold: "Satıldı ✅",
  thinking: "Düşünüyor 🤔",
  lost: "Kaybedildi ❌",
};

export default function PremiumInvitesPanel({ premiumHouses, unlockedIds, premiumResults, onOpen }: PremiumInvitesPanelProps) {
  return (
    <div className="portfolio-panel">
      <p className="menu-empty">
        Ününüz arttıkça daha özel müşteriler sizi doğrudan arıyor. Her davet bir kez cevaplanabilir.
      </p>
      {premiumHouses.map((h) => {
        const unlocked = unlockedIds.includes(h.id);
        const result = premiumResults.find((r) => r.houseId === h.id);

        let status: string;
        let statusClass: string;
        if (result) {
          status = outcomeLabel[result.outcome];
          statusClass = `status-${result.outcome}`;
        } else if (!unlocked) {
          status = "Kilitli 🔒";
          statusClass = "status-locked";
        } else {
          status = "Davet bekliyor";
          statusClass = "status-upcoming";
        }

        return (
          <div className={`portfolio-row ${statusClass}`} key={h.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">{unlocked ? h.title : "??? Özel Davet"}</p>
              <p className="portfolio-row-location">{unlocked ? h.location : "Rütbe atlayınca açılır"}</p>
            </div>
            <div className="portfolio-row-meta">
              <span className="portfolio-row-price">{unlocked ? formatTL(h.askingPrice) : "—"}</span>
              {unlocked && !result ? (
                <button className="pixel-btn small" onClick={() => onOpen(h.id)}>
                  Görüşmeye Git
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
