import type { SaveGame } from "../types";
import { t, getLanguage } from "../data/language";
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
      <h2 className="menu-section-title">{t({ tr: "Kayıtlı Oyunlar", en: "Saved Games" })}</h2>
      {!anySave && <p className="menu-empty">{t({ tr: "Henüz kayıtlı bir oyun yok.", en: "No saved games yet." })}</p>}
      {saves.map((save, slot) => {
        if (!save) {
          return (
            <div className="save-slot save-slot-empty" key={slot}>
              <p className="menu-empty">
                {t({ tr: "Kayıt", en: "Save" })} {slot + 1}: {t({ tr: "boş", en: "empty" })}
              </p>
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
            <p className="save-slot-title">
              {t({ tr: "Kayıt", en: "Save" })} {slot + 1}
            </p>
            <p>
              {t({ tr: "İlerleme", en: "Progress" })}: {t({ tr: "Ev", en: "House" })} {save.index + 1}/{allHouses.length}
            </p>
            <p>
              {t({ tr: "Satış", en: "Sales" })}: {soldCount}
            </p>
            <p>
              {t({ tr: "Toplam Kazanç", en: "Total Earnings" })}: {formatTL(earned)}
            </p>
            <p>
              {t({ tr: "Bakiye", en: "Balance" })}: {formatTL(balance)}
            </p>
            <p>
              {t({ tr: "Rozet", en: "Badges" })}: {save.badges.length}
            </p>
            <p className="save-slot-date">
              {t({ tr: "Son kayıt", en: "Last saved" })}:{" "}
              {new Date(save.savedAt).toLocaleString(getLanguage() === "en" ? "en-US" : "tr-TR")}
            </p>
            <div className="save-slot-actions">
              <button className="pixel-btn" onClick={() => onContinue(slot)}>
                {t({ tr: "Devam Et", en: "Continue" })}
              </button>
              <button className="pixel-btn small danger" onClick={() => onDelete(slot)}>
                {t({ tr: "Sil", en: "Delete" })}
              </button>
            </div>
          </div>
        );
      })}
      <button className="menu-btn ghost" onClick={onBack}>
        {t({ tr: "Geri", en: "Back" })}
      </button>
    </div>
  );
}
