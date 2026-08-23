import { BOSS_MOOD_MAX, BOSS_MOOD_RAISE_THRESHOLD } from "../data/bossMood";
import { poolCharacterById } from "../data/characterPool";
import { dominantTone } from "../data/voiceTone";
import { compassVerdict } from "../data/valuesCompass";
import { friendCharacters } from "../data/friendCharacters";
import { stageForBondCount, type RelationshipStage } from "../data/relationshipStages";
import type { ToneBucket, CompassAxis } from "../types";

interface RelationshipsPanelProps {
  bossMood: number;
  friendBonds: Record<string, number>;
  voiceTally: Record<ToneBucket, number>;
  compassTally: Record<CompassAxis, number>;
  friendBondCounts: Record<string, number>;
  friendFavorAccepted: Record<string, boolean>;
}

const stageLabel: Record<RelationshipStage, string> = {
  taniskilik: "Tanışıklık",
  guven: "Güven",
  yakinlik: "Yakınlık",
};

const toneLabels: Record<ToneBucket, string> = {
  eglenceli: "Eğlenceli",
  samimi: "Samimi",
  atilgan: "Atılgan",
};

/** Small fixed scale for the friendship pips — friendBonds points are rare and small (see meetup.ts), so a 0-100 bar would look broken. */
const FRIEND_BOND_PIPS = 3;

export default function RelationshipsPanel({
  bossMood,
  friendBonds,
  voiceTally,
  compassTally,
  friendBondCounts,
  friendFavorAccepted,
}: RelationshipsPanelProps) {
  const bonded = Object.entries(friendBonds).filter(([, points]) => points > 0);
  const tone = dominantTone(voiceTally);
  const compass = compassVerdict(compassTally);

  return (
    <div className="portfolio-panel">
      <p className="market-category-title">Karakterin</p>
      <div className="portfolio-row">
        <div className="portfolio-row-info">
          <p className="portfolio-row-location">🎭 Baskın ton: {tone ? toneLabels[tone] : "Henüz belirsiz"}</p>
          <p className="portfolio-row-location">🧭 {compass ?? "Pusula henüz belirsiz — daha fazla karar vermen gerek."}</p>
        </div>
      </div>

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

      <p className="market-category-title">Arkadaşların</p>
      <p className="menu-empty">Yakınlık seviyesindeki arkadaşların, evlere girmeden önce bazen sana gerçek bir tüyo veriyor.</p>
      {friendCharacters.map((friend) => {
        const count = friendBondCounts[friend.id] ?? 0;
        const stage = stageForBondCount(count);
        const nextThreshold = stage === "taniskilik" ? 3 : stage === "guven" ? 10 : null;
        return (
          <div className="portfolio-row" key={friend.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">
                {friend.name} <span className="rival-ladder-title">— {friend.profession}</span>
              </p>
              <div className="stat-track relationship-track">
                <div
                  className="stat-fill prestige-fill"
                  style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                />
              </div>
              <p className="portfolio-row-location">
                {stageLabel[stage]}
                {nextThreshold !== null && ` — sıradaki evreye ${Math.max(0, nextThreshold - count)} adım`}
                {friendFavorAccepted[friend.id] && " · 🤝 bir iyilik yaptın"}
              </p>
            </div>
          </div>
        );
      })}

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
