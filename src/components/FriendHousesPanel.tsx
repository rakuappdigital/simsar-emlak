import type { HouseResult, HouseScene, SceneOutcome } from "../types";
import { formatTL } from "../data/economy";
import { friendCharacterForHouseId } from "../data/friendCharacters";

interface FriendHousesPanelProps {
  friendHouses: HouseScene[];
  unlockedIds: string[];
  friendHouseResults: HouseResult[];
  onOpen: (houseId: string) => void;
}

const outcomeLabel: Record<SceneOutcome, string> = {
  sold: "Satıldı ✅",
  thinking: "Düşünüyor 🤔",
  lost: "Kaybedildi ❌",
};

export default function FriendHousesPanel({ friendHouses, unlockedIds, friendHouseResults, onOpen }: FriendHousesPanelProps) {
  const visible = friendHouses.filter((h) => unlockedIds.includes(h.id));
  return (
    <div className="portfolio-panel">
      <p className="menu-empty">
        Arkadaşların arada bir sana ev önerir — mesajlardan randevu kabul edersen burada listelenir.
      </p>
      {visible.length === 0 && <p className="menu-empty">Henüz kabul edilmiş bir arkadaş randevusu yok.</p>}
      {visible.map((h) => {
        const result = friendHouseResults.find((r) => r.houseId === h.id);
        const friend = friendCharacterForHouseId(h.id);

        let status: string;
        let statusClass: string;
        if (result) {
          status = outcomeLabel[result.outcome];
          statusClass = `status-${result.outcome}`;
        } else {
          status = "Randevu bekliyor";
          statusClass = "status-upcoming";
        }

        return (
          <div className={`portfolio-row ${statusClass}`} key={h.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">
                {h.title} {friend && <span className="friend-tag">🤝 {friend.name}</span>}
              </p>
              <p className="portfolio-row-location">{h.location}</p>
            </div>
            <div className="portfolio-row-meta">
              <span className="portfolio-row-price">{formatTL(h.askingPrice)}</span>
              {!result ? (
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
