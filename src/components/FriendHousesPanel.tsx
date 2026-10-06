import type { HouseResult, HouseScene, SceneOutcome } from "../types";
import { formatTL } from "../data/economy";
import { friendCharacterForHouseId } from "../data/friendCharacters";
import { resolveHouseTitle, resolveHouseLocation, t } from "../data/language";
import LockedCard from "./LockedCard";
import { PeopleIcon } from "./icons";

interface FriendHousesPanelProps {
  friendHouses: HouseScene[];
  unlockedIds: string[];
  friendHouseResults: HouseResult[];
  onOpen: (houseId: string) => void;
}

function outcomeLabel(outcome: SceneOutcome): string {
  if (outcome === "sold") return `${t({ tr: "Satıldı", en: "Sold" })}`;
  if (outcome === "thinking") return `${t({ tr: "Düşünüyor", en: "Thinking" })}`;
  return `${t({ tr: "Kaybedildi", en: "Lost" })}`;
}

export default function FriendHousesPanel({ friendHouses, unlockedIds, friendHouseResults, onOpen }: FriendHousesPanelProps) {
  const visible = friendHouses.filter((h) => unlockedIds.includes(h.id));
  return (
    <div className="portfolio-panel">
      <p className="menu-empty">
        {t({
          tr: "Arkadaşların arada bir sana ev önerir — mesajlardan randevu kabul edersen burada listelenir.",
          en: "Your friends occasionally suggest houses to you — accepting an appointment from messages lists it here.",
        })}
      </p>
      {visible.length === 0 && (
        <LockedCard
          icon={<PeopleIcon size={16} />}
          title={t({ tr: "Henüz arkadaş randevusu yok", en: "No friend appointments yet" })}
          hint={t({
            tr: "Bir arkadaşın ev önerdiğinde Telefon'daki mesajdan randevuyu kabul et; ev burada belirir.",
            en: "When a friend suggests a house, accept the appointment from their message in Phone; it shows up here.",
          })}
        />
      )}
      {visible.map((h) => {
        const result = friendHouseResults.find((r) => r.houseId === h.id);
        const friend = friendCharacterForHouseId(h.id);

        let status: string;
        let statusClass: string;
        if (result) {
          status = outcomeLabel(result.outcome);
          statusClass = `status-${result.outcome}`;
        } else {
          status = t({ tr: "Randevu bekliyor", en: "Appointment pending" });
          statusClass = "status-upcoming";
        }

        return (
          <div className={`portfolio-row ${statusClass}`} key={h.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">
                {resolveHouseTitle(h)} {friend && <span className="friend-tag"> {friend.name}</span>}
              </p>
              <p className="portfolio-row-location">{resolveHouseLocation(h)}</p>
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
    </div>
  );
}
