import { useState } from "react";
import { getSfxVolume, getMusicVolume, setSfxVolume, setMusicVolume, startMusic, stopMusic, playClick } from "../data/sound";

interface SettingsScreenProps {
  onBack: () => void;
}

/**
 * Single settings screen with room to grow: each future setting (e.g.
 * difficulty, language) gets its own "menu-section-title" block below Ses,
 * not a whole new menu stage.
 */
export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [music, setMusic] = useState(getMusicVolume);
  const [sfx, setSfx] = useState(getSfxVolume);

  function handleMusicChange(v: number) {
    setMusic(v);
    setMusicVolume(v);
    if (v > 0) startMusic();
    else stopMusic();
  }

  function handleSfxChange(v: number) {
    setSfx(v);
    setSfxVolume(v);
  }

  return (
    <div className="menu-screen">
      <h2 className="menu-section-title">Ayarlar</h2>

      <p className="settings-subsection-title">Ses</p>
      <div className="sound-row">
        <span>Müzik</span>
        <input
          type="range"
          min={0}
          max={100}
          value={music}
          onChange={(e) => handleMusicChange(Number(e.target.value))}
        />
      </div>
      <div className="sound-row">
        <span>Efektler</span>
        <input
          type="range"
          min={0}
          max={100}
          value={sfx}
          onChange={(e) => handleSfxChange(Number(e.target.value))}
          onMouseUp={() => playClick()}
        />
      </div>

      <button className="menu-btn ghost" onClick={onBack}>
        Geri
      </button>
    </div>
  );
}
