interface SoundSettingsProps {
  onBack: () => void;
}

export default function SoundSettings({ onBack }: SoundSettingsProps) {
  return (
    <div className="menu-screen">
      <h2 className="menu-section-title">Sesler</h2>
      <div className="sound-row">
        <span>Müzik</span>
        <input type="range" min={0} max={100} defaultValue={70} disabled />
      </div>
      <div className="sound-row">
        <span>Efektler</span>
        <input type="range" min={0} max={100} defaultValue={70} disabled />
      </div>
      <p className="menu-empty">Ses ve müzik yakında ekleniyor 🎵</p>
      <button className="menu-btn ghost" onClick={onBack}>Geri</button>
    </div>
  );
}
