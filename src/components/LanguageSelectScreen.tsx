import { LogoIcon } from "./icons";
import { setLanguage, type Language } from "../data/language";

interface LanguageSelectScreenProps {
  onChosen: (lang: Language) => void;
}

export default function LanguageSelectScreen({ onChosen }: LanguageSelectScreenProps) {
  function choose(lang: Language) {
    setLanguage(lang);
    onChosen(lang);
  }

  return (
    <div className="menu-screen">
      <div className="menu-title-block">
        <LogoIcon size={56} className="app-logo" />
        <h1 className="menu-title">Odd Estate</h1>
        <p className="menu-subtitle">Choose your language / Dil seçin</p>
      </div>
      <nav className="menu-buttons">
        <button className="menu-btn" onClick={() => choose("en")}>
          🇬🇧 English
        </button>
        <button className="menu-btn" onClick={() => choose("tr")}>
          🇹🇷 Türkçe
        </button>
      </nav>
    </div>
  );
}
