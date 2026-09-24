import type { ToneBucket } from "../types";
import { t, getLanguage } from "../data/language";
import { getLifetimeClicks } from "../data/clickCounter";
import { getPrestigeCompletions } from "../data/prestige";
import { dominantTone } from "../data/voiceTone";
import { CloseIcon } from "./icons";

interface SecretStatsScreenProps {
  bossMood: number;
  voiceTally: Record<ToneBucket, number>;
  easterEggsSeenCount: number;
  pressureChoicesTaken: number;
  onClose: () => void;
}

const toneLabelsByLang: Record<ToneBucket, { tr: string; en: string }> = {
  eglenceli: { tr: "Eğlenceli", en: "Playful" },
  samimi: { tr: "Samimi", en: "Friendly" },
  atilgan: { tr: "Atılgan", en: "Bold" },
};

/** iOS'ta konsol easter egg'inin yerini tutan, oyun içinde bulunabilen gizli bir sır. */
export default function SecretStatsScreen({
  bossMood,
  voiceTally,
  easterEggsSeenCount,
  pressureChoicesTaken,
  onClose,
}: SecretStatsScreenProps) {
  const tone = dominantTone(voiceTally);
  return (
    <div className="modal-overlay">
      <div className="market-modal secret-stats-modal">
        <div className="market-header">
          <h2 className="market-title">🕵️ {t({ tr: "Gizli İstatistikler", en: "Secret Statistics" })}</h2>
          <button className="market-close" onClick={onClose} aria-label={t({ tr: "Kapat", en: "Close" })}>
            <CloseIcon size={12} />
          </button>
        </div>
        <div className="secret-stats-body">
          <p>{t({ tr: "Bunu bulman gerçekten iyiydi. Kimseye söyleme.", en: "It was really something that you found this. Don't tell anyone." })}</p>
          <ul className="secret-stats-list">
            <li>
              👆 {t({ tr: "Bu cihazda ömür boyu tıklama", en: "Lifetime clicks on this device" })}:{" "}
              <strong>{getLifetimeClicks().toLocaleString(getLanguage() === "en" ? "en-US" : "tr-TR")}</strong>
            </li>
            <li>
              🏆 {t({ tr: "Tamamlanan Efsane turu", en: "Legend playthroughs completed" })}: <strong>{getPrestigeCompletions()}</strong>
            </li>
            <li>
              😊 {t({ tr: "Şu anki Patron Memnuniyeti", en: "Current Boss Mood" })}: <strong>{bossMood}</strong>
            </li>
            <li>
              🎭 {t({ tr: "Baskın ton (bu oyun)", en: "Dominant tone (this game)" })}:{" "}
              <strong>{tone ? t(toneLabelsByLang[tone]) : t({ tr: "Henüz belirsiz", en: "Not yet clear" })}</strong>
            </li>
            <li>
              ✨ {t({ tr: "Bu oyunda görülen tuhaf an", en: "Odd moments seen this game" })}: <strong>{easterEggsSeenCount}</strong>
            </li>
            <li>
              ⚠️ {t({ tr: '"Son dakika baskısı" tuzağına düşme', en: 'Falling for the "last-minute pressure" trap' })}:{" "}
              <strong>{pressureChoicesTaken}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
