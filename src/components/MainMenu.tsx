import { LogoIcon } from "./icons";
import { getPrestigeCompletions, prestigeTitle } from "../data/prestige";

interface MainMenuProps {
  hasSave: boolean;
  onNewGame: () => void;
  onOpenSaved: () => void;
  onSettings: () => void;
}

export default function MainMenu({ hasSave, onNewGame, onOpenSaved, onSettings }: MainMenuProps) {
  const title = prestigeTitle(getPrestigeCompletions());
  return (
    <div className="menu-screen">
      <div className="menu-title-block">
        <LogoIcon size={56} className="app-logo" />
        <h1 className="menu-title">Simsar Emlak</h1>
        <p className="menu-subtitle">İstanbul'un en... yaratıcı emlakçısı</p>
        {title && <p className="menu-prestige-tag">🏆 {title} — yeni oyun bonusla başlar</p>}
      </div>
      <nav className="menu-buttons">
        <button className="menu-btn" onClick={onNewGame}>
          Oyuna Başla
        </button>
        <button className="menu-btn" onClick={onOpenSaved} disabled={!hasSave}>
          Kayıtlı Oyunlar
        </button>
        <button className="menu-btn" onClick={onSettings}>
          Ayarlar
        </button>
      </nav>
    </div>
  );
}
