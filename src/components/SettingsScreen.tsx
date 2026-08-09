import { useState } from "react";
import { getSfxVolume, getMusicVolume, setSfxVolume, setMusicVolume, startMusic, stopMusic, playClick } from "../data/sound";
import { getDifficulty, setDifficulty, difficultyLabels, type Difficulty } from "../data/difficulty";

interface SettingsScreenProps {
  onBack: () => void;
}

const difficulties: Difficulty[] = ["kolay", "normal", "zor"];

/**
 * Single settings screen with room to grow: each future setting gets its
 * own "menu-section-title" block below Ses, not a whole new menu stage.
 */
export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [music, setMusic] = useState(getMusicVolume);
  const [sfx, setSfx] = useState(getSfxVolume);
  const [difficulty, setDifficultyState] = useState(getDifficulty);

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

  function handleDifficultyChange(d: Difficulty) {
    setDifficultyState(d);
    setDifficulty(d);
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

      <p className="settings-subsection-title">Zorluk</p>
      <div className="difficulty-row">
        {difficulties.map((d) => (
          <button
            key={d}
            className={`difficulty-btn ${difficulty === d ? "active" : ""}`}
            onClick={() => handleDifficultyChange(d)}
          >
            {difficultyLabels[d]}
          </button>
        ))}
      </div>
      <p className="menu-empty">Şüphenin ne kadar hızlı arttığını etkiler. Normal, oyunun her zamanki dengesidir.</p>

      <button className="menu-btn ghost" onClick={onBack}>
        Geri
      </button>
    </div>
  );
}
