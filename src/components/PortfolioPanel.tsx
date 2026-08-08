import type { HouseResult, HouseScene, SceneOutcome } from "../types";
import { formatTL } from "../data/economy";

interface PortfolioPanelProps {
  allHouses: HouseScene[];
  houseOrder: number[];
  results: HouseResult[];
  unlockedTiers: number[];
  currentIndex: number;
}

const outcomeLabel: Record<SceneOutcome, string> = {
  sold: "Satıldı ✅",
  thinking: "Düşünüyor 🤔",
  lost: "Kaybedildi ❌",
};

export default function PortfolioPanel({
  allHouses,
  houseOrder,
  results,
  unlockedTiers,
  currentIndex,
}: PortfolioPanelProps) {
  const maxUnlockedTier = Math.max(...unlockedTiers);

  return (
    <div className="portfolio-panel">
      {allHouses.map((h) => {
        const playedIdx = houseOrder.indexOf(allHouses.indexOf(h));
        const result = playedIdx !== -1 && playedIdx < results.length ? results[playedIdx] : undefined;

        let status: string;
        let statusClass: string;
        if (result) {
          status = outcomeLabel[result.outcome] + (result.converted ? " (sonradan ikna)" : "");
          statusClass = `status-${result.outcome}`;
        } else if (h.tier > maxUnlockedTier) {
          status = "Kilitli 🔒";
          statusClass = "status-locked";
        } else if (playedIdx === currentIndex) {
          status = "Şu an burada";
          statusClass = "status-current";
        } else {
          status = "Sırada";
          statusClass = "status-upcoming";
        }

        return (
          <div className={`portfolio-row ${statusClass}`} key={h.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">{h.title}</p>
              <p className="portfolio-row-location">{h.location} · Tier {h.tier}</p>
            </div>
            <div className="portfolio-row-meta">
              <span className="portfolio-row-price">{formatTL(h.askingPrice)}</span>
              <span className="portfolio-row-status">{status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
