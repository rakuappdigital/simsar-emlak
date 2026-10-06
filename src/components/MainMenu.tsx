import { LogoIcon } from "./icons";
import { getPrestigeCompletions, prestigeTitle } from "../data/prestige";
import type { Language } from "../data/language";
import { TrophyIcon } from "./icons";

interface MainMenuProps {
  hasSave: boolean;
  language: Language;
  onNewGame: () => void;
  onOpenSaved: () => void;
  onSettings: () => void;
}

const strings = {
  subtitle: { tr: "İstanbul'un en... yaratıcı emlakçısı", en: "Istanbul's most... creative real estate agent" },
  newGame: { tr: "Oyuna Başla", en: "Start Game" },
  savedGames: { tr: "Kayıtlı Oyunlar", en: "Saved Games" },
  settings: { tr: "Ayarlar", en: "Settings" },
  prestigeTag: { tr: "yeni oyun bonusla başlar", en: "new game starts with a bonus" },
};

export default function MainMenu({ hasSave, language, onNewGame, onOpenSaved, onSettings }: MainMenuProps) {
  const title = prestigeTitle(getPrestigeCompletions());
  return (
    <div className="menu-screen">
      <div className="menu-title-block">
        <LogoIcon size={56} className="app-logo" />
        <h1 className="menu-title">Odd Estate</h1>
        <p className="menu-subtitle">{strings.subtitle[language]}</p>
        {title && <p className="menu-prestige-tag"><TrophyIcon size={12} className="icon-inline" /> {title} — {strings.prestigeTag[language]}</p>}
      </div>
      <nav className="menu-buttons">
        <button className="menu-btn" onClick={onNewGame}>
          {strings.newGame[language]}
        </button>
        <button className="menu-btn" onClick={onOpenSaved} disabled={!hasSave}>
          {strings.savedGames[language]}
        </button>
        <button className="menu-btn" onClick={onSettings}>
          {strings.settings[language]}
        </button>
      </nav>
    </div>
  );
}
