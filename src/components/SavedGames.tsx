import type { SaveGame } from "../types";
import { allHouses } from "../data/houses";
import { formatTL } from "../data/economy";

interface SavedGamesProps {
  saves: (SaveGame | null)[];
  onContinue: (slot: number) => void;
  onDelete: (slot: number) => void;
  onBack: () => void;
}

export default function SavedGames({ saves, onContinue, onDelete, onBack }: SavedGamesProps) {
  const anySave = saves.some((s) => s !== null);

  return (
    <div className="menu-screen">
      <h2 className="menu-section-title">Kayıtlı Oyunlar</h2>
      {!anySave && <p className="menu-empty">Henüz kayıtlı bir oyun yok.</p>}
      {saves.map((save, slot) => {
        if (!save) {
          return (
            <div className="save-slot save-slot-empty" key={slot}>
              <p className="menu-empty">Kayıt {slot + 1}: boş</p>
            </div>
          );
        }
        const earned =
          save.results.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0) +
          save.weekOutcomes.reduce((sum, w) => sum + w.bonus, 0);
        const balance = earned - save.spent;
        const soldCount = save.results.filter((r) => r.outcome === "sold").length;

        return (
          <div className="save-slot" key={slot}>
            <p className="save-slot-title">Kayıt {slot + 1}</p>
            <p>İlerleme: Ev {save.index + 1}/{allHouses.length}</p>
            <p>Satış: {soldCount}</p>
            <p>Toplam Kazanç: {formatTL(earned)}</p>
            <p>Bakiye: {formatTL(balance)}</p>
            <p>Rozet: {save.badges.length}</p>
            <p className="save-slot-date">Son kayıt: {new Date(save.savedAt).toLocaleString("tr-TR")}</p>
            <div className="save-slot-actions">
              <button className="pixel-btn" onClick={() => onContinue(slot)}>Devam Et</button>
              <button className="pixel-btn small danger" onClick={() => onDelete(slot)}>Sil</button>
            </div>
          </div>
        );
      })}
      <button className="menu-btn ghost" onClick={onBack}>Geri</button>
    </div>
  );
}
