import type { ToneBucket } from "../types";
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

const toneLabels: Record<ToneBucket, string> = {
  eglenceli: "Eğlenceli",
  samimi: "Samimi",
  atilgan: "Atılgan",
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
          <h2 className="market-title">🕵️ Gizli İstatistikler</h2>
          <button className="market-close" onClick={onClose} aria-label="Kapat">
            <CloseIcon size={12} />
          </button>
        </div>
        <div className="secret-stats-body">
          <p>Bunu bulman gerçekten iyiydi. Kimseye söyleme.</p>
          <ul className="secret-stats-list">
            <li>👆 Bu cihazda ömür boyu tıklama: <strong>{getLifetimeClicks().toLocaleString("tr-TR")}</strong></li>
            <li>🏆 Tamamlanan Efsane turu: <strong>{getPrestigeCompletions()}</strong></li>
            <li>😊 Şu anki Patron Memnuniyeti: <strong>{bossMood}</strong></li>
            <li>🎭 Baskın ton (bu oyun): <strong>{tone ? toneLabels[tone] : "Henüz belirsiz"}</strong></li>
            <li>✨ Bu oyunda görülen tuhaf an: <strong>{easterEggsSeenCount}</strong></li>
            <li>⚠️ "Son dakika baskısı" tuzağına düşme: <strong>{pressureChoicesTaken}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
