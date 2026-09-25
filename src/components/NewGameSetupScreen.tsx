import { useState } from "react";
import { getSfxVolume, getMusicVolume, setSfxVolume, setMusicVolume, playClick } from "../data/sound";
import { getDialogueStyle, setDialogueStyle, dialogueStyleLabels, type DialogueStyle } from "../data/dialogueStyle";
import { resolveText, t } from "../data/language";

interface NewGameSetupScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

const dialogueStyles: DialogueStyle[] = ["notr", "esprili", "resmi"];

/**
 * Shown once, right when "Start Game" is tapped — before origin select.
 * Speaking style is chosen here and locked for the whole playthrough (no
 * longer exposed in Settings, see dialogueStyle.ts); music/sound are also
 * offered here as a convenience but stay freely adjustable in Settings too.
 */
export default function NewGameSetupScreen({ onContinue, onBack }: NewGameSetupScreenProps) {
  const [dialogueStyle, setDialogueStyleState] = useState(getDialogueStyle);
  const [music, setMusic] = useState(getMusicVolume);
  const [sfx, setSfx] = useState(getSfxVolume);

  function handleDialogueStyleChange(s: DialogueStyle) {
    setDialogueStyleState(s);
    setDialogueStyle(s);
  }

  function handleMusicChange(v: number) {
    setMusic(v);
    setMusicVolume(v);
  }

  function handleSfxChange(v: number) {
    setSfx(v);
    setSfxVolume(v);
  }

  return (
    <div className="menu-screen">
      <div className="menu-title-block">
        <h1 className="menu-title">{t({ tr: "Yeni Oyun", en: "New Game" })}</h1>
        <p className="menu-subtitle">
          {t({
            tr: "Başlamadan önce birkaç tercih yapalım.",
            en: "Let's set a few preferences before we start.",
          })}
        </p>
      </div>

      <p className="settings-subsection-title">{t({ tr: "Konuşma Tarzı", en: "Speaking Style" })}</p>
      <div className="difficulty-row">
        {dialogueStyles.map((s) => (
          <button
            key={s}
            className={`difficulty-btn ${dialogueStyle === s ? "active" : ""}`}
            onClick={() => handleDialogueStyleChange(s)}
          >
            {resolveText(dialogueStyleLabels[s])}
          </button>
        ))}
      </div>
      <p className="menu-empty">
        {t({
          tr: "Emlah'ın kendi cümlelerine ara sıra küçük bir dokunuş ekler (ünlem, gülücük) — hiçbir cümleyi değiştirmez. Oyun boyunca değiştirilemez, sadece burada seçilir.",
          en: "Occasionally adds a small touch to Estetan's own lines (an exclamation, a smile) — never changes any dialogue. Locked for the whole playthrough, only chosen here.",
        })}
      </p>

      <p className="settings-subsection-title">{t({ tr: "Ses", en: "Sound" })}</p>
      <div className="sound-row">
        <span>{t({ tr: "Müzik", en: "Music" })}</span>
        <input type="range" min={0} max={100} value={music} onChange={(e) => handleMusicChange(Number(e.target.value))} />
      </div>
      <div className="sound-row">
        <span>{t({ tr: "Efektler", en: "Effects" })}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={sfx}
          onChange={(e) => handleSfxChange(Number(e.target.value))}
          onMouseUp={() => playClick()}
        />
      </div>

      <nav className="menu-buttons">
        <button className="menu-btn" onClick={onContinue}>
          {t({ tr: "Devam Et", en: "Continue" })}
        </button>
        <button className="menu-btn ghost" onClick={onBack}>
          {t({ tr: "Geri", en: "Back" })}
        </button>
      </nav>
    </div>
  );
}
