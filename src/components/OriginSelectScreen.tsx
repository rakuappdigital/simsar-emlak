import type { OriginDef } from "../data/origin";
import type { OriginId } from "../types";
import { resolveText, t } from "../data/language";

interface OriginSelectScreenProps {
  origins: OriginDef[];
  onSelect: (originId: OriginId) => void;
  onBack: () => void;
}

/** "Emlah'ın Geçmişi" — a one-time backstory pick shown before every new game. See data/origin.ts. */
export default function OriginSelectScreen({ origins, onSelect, onBack }: OriginSelectScreenProps) {
  return (
    <div className="menu-screen">
      <div className="menu-title-block">
        <h1 className="menu-title">{t({ tr: "Emlah'ın Geçmişi", en: "Estetan's Backstory" })}</h1>
        <p className="menu-subtitle">
          {t({
            tr: "Bu işe nereden geldin? Seçimin, tüm oyun boyunca konuşma tarzını şekillendirecek.",
            en: "Where did you come to this job from? Your choice will shape your conversation style throughout the game.",
          })}
        </p>
      </div>
      <div className="origin-list">
        {origins.map((o) => (
          <button key={o.id} className="origin-card" onClick={() => onSelect(o.id)}>
            <span className="origin-card-title">{resolveText(o.title)}</span>
            <span className="origin-card-description">{resolveText(o.description)}</span>
          </button>
        ))}
      </div>
      <button className="menu-btn ghost" onClick={onBack}>
        {t({ tr: "Geri", en: "Back" })}
      </button>
    </div>
  );
}
