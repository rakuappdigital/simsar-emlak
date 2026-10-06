import { t } from "../data/language";
import { CloseIcon } from "./icons";

interface SideStoryModalProps {
  title: string;
  lines: string[];
  closeLabel?: string;
  onClose: () => void;
}

/** Yan görev anları (Muhtar'ın Defteri, soruşturma adımları, anahtar) — sade bir okuma kartı. */
export default function SideStoryModal({ title, lines, closeLabel, onClose }: SideStoryModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="side-story" onClick={(e) => e.stopPropagation()}>
        <div className="side-story-head">
          <h2 className="side-story-title">{title}</h2>
          <button className="market-close" onClick={onClose} aria-label={t({ tr: "Kapat", en: "Close" })}>
            <CloseIcon size={12} />
          </button>
        </div>
        {lines.map((l, i) => (
          <p key={i} className="side-story-line">
            {l}
          </p>
        ))}
        <button className="pixel-btn side-story-btn" onClick={onClose}>
          {closeLabel ?? t({ tr: "Tamam", en: "OK" })}
        </button>
      </div>
    </div>
  );
}
