import type { OriginDef } from "../data/origin";
import type { OriginId } from "../types";

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
        <h1 className="menu-title">Emlah'ın Geçmişi</h1>
        <p className="menu-subtitle">Bu işe nereden geldin? Seçimin, tüm oyun boyunca konuşma tarzını şekillendirecek.</p>
      </div>
      <div className="origin-list">
        {origins.map((o) => (
          <button key={o.id} className="origin-card" onClick={() => onSelect(o.id)}>
            <span className="origin-card-title">{o.title}</span>
            <span className="origin-card-description">{o.description}</span>
          </button>
        ))}
      </div>
      <button className="menu-btn ghost" onClick={onBack}>
        Geri
      </button>
    </div>
  );
}
