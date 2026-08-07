import type { SaveGame } from "../types";
import { allHouses } from "../data/houses";
import { formatTL } from "../data/economy";

interface SavedGamesProps {
  save: SaveGame | null;
  onContinue: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export default function SavedGames({ save, onContinue, onDelete, onBack }: SavedGamesProps) {
  const totalCommission = save?.results.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0) ?? 0;
  const soldCount = save?.results.filter((r) => r.outcome === "sold").length ?? 0;

  return (
    <div className="menu-screen">
      <h2 className="menu-section-title">Kayıtlı Oyunlar</h2>
      {!save && <p className="menu-empty">Henüz kayıtlı bir oyun yok.</p>}
      {save && (
        <div className="save-slot">
          <p>İlerleme: Ev {save.index + 1}/{allHouses.length}</p>
          <p>Satış: {soldCount}</p>
          <p>Toplam Komisyon: {formatTL(totalCommission)}</p>
          <p>Rozet: {save.badges.length}</p>
          <p className="save-slot-date">Son kayıt: {new Date(save.savedAt).toLocaleString("tr-TR")}</p>
          <div className="save-slot-actions">
            <button className="pixel-btn" onClick={onContinue}>Devam Et</button>
            <button className="pixel-btn small danger" onClick={onDelete}>Sil</button>
          </div>
        </div>
      )}
      <button className="menu-btn ghost" onClick={onBack}>Geri</button>
    </div>
  );
}
