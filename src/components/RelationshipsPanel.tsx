import { BOSS_MOOD_MAX, BOSS_MOOD_RAISE_THRESHOLD } from "../data/bossMood";
import { poolCharacterById } from "../data/characterPool";

interface RelationshipsPanelProps {
  bossMood: number;
  friendBonds: Record<string, number>;
}

/** Small fixed scale for the friendship pips — friendBonds points are rare and small (see meetup.ts), so a 0-100 bar would look broken. */
const FRIEND_BOND_PIPS = 3;

export default function RelationshipsPanel({ bossMood, friendBonds }: RelationshipsPanelProps) {
  const bonded = Object.entries(friendBonds).filter(([, points]) => points > 0);

  return (
    <div className="portfolio-panel">
      <p className="market-category-title">Patron</p>
      <div className="portfolio-row">
        <div className="portfolio-row-info">
          <p className="portfolio-row-title">Muzaffer Bey</p>
          <div className="stat-track relationship-track">
            <div
              className={`stat-fill boss-mood-fill ${bossMood < BOSS_MOOD_RAISE_THRESHOLD ? "energy-fill-low" : ""}`}
              style={{ width: `${Math.min(100, (bossMood / BOSS_MOOD_MAX) * 100)}%` }}
            />
          </div>
          <p className="portfolio-row-location">
            {bossMood < BOSS_MOOD_RAISE_THRESHOLD
              ? "Senden pek memnun değil — indirimlere dikkat et."
              : "Senden memnun, hafta sonunda zam ihtimalin yüksek."}
          </p>
        </div>
      </div>

      <p className="market-category-title">Bağlantılar</p>
      {bonded.length === 0 && <p className="menu-empty">Henüz kimseyle özel bir bağın yok.</p>}
      {bonded.map(([characterId, points]) => {
        const character = poolCharacterById(characterId);
        return (
          <div className="portfolio-row" key={characterId}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">{character?.name ?? characterId}</p>
              <p className="relationship-pips">
                {Array.from({ length: FRIEND_BOND_PIPS }, (_, i) => (i < points ? "❤️" : "🤍")).join(" ")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
