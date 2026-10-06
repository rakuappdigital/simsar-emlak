import { BOSS_MOOD_MAX, BOSS_MOOD_RAISE_THRESHOLD } from "../data/bossMood";
import { poolCharacterById } from "../data/characterPool";
import { dominantTone } from "../data/voiceTone";
import { compassVerdict } from "../data/valuesCompass";
import { friendCharacters } from "../data/friendCharacters";
import { resolveText, t } from "../data/language";
import { stageForBondCount, type RelationshipStage } from "../data/relationshipStages";
import type { ToneBucket, CompassAxis } from "../types";
import { HeartIcon } from "./icons";

interface RelationshipsPanelProps {
  bossMood: number;
  friendBonds: Record<string, number>;
  voiceTally: Record<ToneBucket, number>;
  compassTally: Record<CompassAxis, number>;
  friendBondCounts: Record<string, number>;
  friendFavorAccepted: Record<string, boolean>;
}

const stageLabelByLang: Record<RelationshipStage, { tr: string; en: string }> = {
  taniskilik: { tr: "Tanışıklık", en: "Acquaintance" },
  guven: { tr: "Güven", en: "Trust" },
  yakinlik: { tr: "Yakınlık", en: "Closeness" },
};
function stageLabel(stage: RelationshipStage): string {
  return t(stageLabelByLang[stage]);
}

const toneLabelsByLang: Record<ToneBucket, { tr: string; en: string }> = {
  eglenceli: { tr: "Eğlenceli", en: "Playful" },
  samimi: { tr: "Samimi", en: "Friendly" },
  atilgan: { tr: "Atılgan", en: "Bold" },
};
function toneLabel(tone: ToneBucket): string {
  return t(toneLabelsByLang[tone]);
}

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
      <p className="market-category-title">{t({ tr: "Karakterin", en: "Your Character" })}</p>
      <div className="portfolio-row">
        <div className="portfolio-row-info">
          <p className="portfolio-row-location">
            {t({ tr: "Baskın ton", en: "Dominant tone" })}: {tone ? toneLabel(tone) : t({ tr: "Henüz belirsiz", en: "Not yet clear" })}
          </p>
          <p className="portfolio-row-location">
            {compass ?? t({ tr: "Pusula henüz belirsiz — daha fazla karar vermen gerek.", en: "The compass isn't clear yet — you need to make more decisions." })}
          </p>
        </div>
      </div>

      <p className="market-category-title">{t({ tr: "Patron", en: "Boss" })}</p>
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
              ? t({ tr: "Senden pek memnun değil — indirimlere dikkat et.", en: "He's not very pleased with you — watch out with discounts." })
              : t({ tr: "Senden memnun, hafta sonunda zam ihtimalin yüksek.", en: "He's pleased with you, a raise at the end of the week is likely." })}
          </p>
        </div>
      </div>

      <p className="market-category-title">{t({ tr: "Arkadaşların", en: "Your Friends" })}</p>
      <p className="menu-empty">
        {t({
          tr: "Yakınlık seviyesindeki arkadaşların, evlere girmeden önce bazen sana gerçek bir tüyo veriyor.",
          en: "Friends at the Closeness level sometimes give you a real tip before you enter a house.",
        })}
      </p>
      {friendCharacters.map((friend) => {
        const count = friendBondCounts[friend.id] ?? 0;
        const stage = stageForBondCount(count);
        const nextThreshold = stage === "taniskilik" ? 3 : stage === "guven" ? 10 : null;
        return (
          <div className="portfolio-row" key={friend.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">
                {friend.name} <span className="rival-ladder-title">— {resolveText(friend.profession)}</span>
              </p>
              <div className="stat-track relationship-track">
                <div
                  className="stat-fill prestige-fill"
                  style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                />
              </div>
              <p className="portfolio-row-location">
                {stageLabel(stage)}
                {nextThreshold !== null &&
                  ` — ${t({
                    tr: `sıradaki evreye ${Math.max(0, nextThreshold - count)} adım`,
                    en: `${Math.max(0, nextThreshold - count)} steps to the next stage`,
                  })}`}
                {friendFavorAccepted[friend.id] && ` · ${t({ tr: "bir iyilik yaptın", en: "you did a favor" })}`}
              </p>
            </div>
          </div>
        );
      })}

      <p className="market-category-title">{t({ tr: "Bağlantılar", en: "Connections" })}</p>
      {bonded.length === 0 && (
        <p className="menu-empty">{t({ tr: "Henüz kimseyle özel bir bağın yok.", en: "You don't have a special bond with anyone yet." })}</p>
      )}
      {bonded.map(([characterId, points]) => {
        const character = poolCharacterById(characterId);
        return (
          <div className="portfolio-row" key={characterId}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">{character?.name ?? characterId}</p>
              <p className="relationship-pips">
                {Array.from({ length: FRIEND_BOND_PIPS }, (_, i) => (
                  <HeartIcon key={i} size={12} className={i < points ? "bond-pip-on" : "bond-pip-off"} />
                ))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
