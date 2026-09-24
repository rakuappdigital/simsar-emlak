import { useState } from "react";
import type { HouseResult, HouseScene, SceneOutcome } from "../types";
import { formatTL } from "../data/economy";
import { resolveHouseTitle, resolveHouseLocation, t } from "../data/language";

interface PortfolioPanelProps {
  allHouses: HouseScene[];
  houseOrder: number[];
  results: HouseResult[];
  unlockedTiers: number[];
  currentIndex: number;
}

function outcomeLabel(outcome: SceneOutcome): string {
  if (outcome === "sold") return `${t({ tr: "Satıldı", en: "Sold" })} ✅`;
  if (outcome === "thinking") return `${t({ tr: "Düşünüyor", en: "Thinking" })} 🤔`;
  return `${t({ tr: "Kaybedildi", en: "Lost" })} ❌`;
}

export default function PortfolioPanel({
  allHouses,
  houseOrder,
  results,
  unlockedTiers,
  currentIndex,
}: PortfolioPanelProps) {
  const maxUnlockedTier = Math.max(...unlockedTiers);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("tr");
  const filteredHouses = normalizedQuery
    ? allHouses.filter(
        (h) =>
          h.title.toLocaleLowerCase("tr").includes(normalizedQuery) ||
          h.location.toLocaleLowerCase("tr").includes(normalizedQuery) ||
          resolveHouseTitle(h).toLocaleLowerCase().includes(normalizedQuery) ||
          resolveHouseLocation(h).toLocaleLowerCase().includes(normalizedQuery),
      )
    : allHouses;

  return (
    <div className="portfolio-panel">
      <input
        type="text"
        className="portfolio-search"
        placeholder={t({ tr: "Ev veya semt ara...", en: "Search house or district..." })}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filteredHouses.length === 0 && (
        <p className="menu-empty">{t({ tr: "Eşleşen ev bulunamadı.", en: "No matching house found." })}</p>
      )}
      {filteredHouses.map((h) => {
        const playedIdx = houseOrder.indexOf(allHouses.indexOf(h));
        const result = playedIdx !== -1 && playedIdx < results.length ? results[playedIdx] : undefined;

        let status: string;
        let statusClass: string;
        if (result) {
          status = outcomeLabel(result.outcome) + (result.converted ? ` (${t({ tr: "sonradan ikna", en: "convinced later" })})` : "");
          statusClass = `status-${result.outcome}`;
        } else if (h.tier > maxUnlockedTier) {
          status = `${t({ tr: "Kilitli", en: "Locked" })} 🔒`;
          statusClass = "status-locked";
        } else if (playedIdx === currentIndex) {
          status = t({ tr: "Şu an burada", en: "Here now" });
          statusClass = "status-current";
        } else {
          status = t({ tr: "Sırada", en: "Up Next" });
          statusClass = "status-upcoming";
        }

        return (
          <div className={`portfolio-row ${statusClass}`} key={h.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">{resolveHouseTitle(h)}</p>
              <p className="portfolio-row-location">
                {resolveHouseLocation(h)} · Tier {h.tier}
              </p>
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
