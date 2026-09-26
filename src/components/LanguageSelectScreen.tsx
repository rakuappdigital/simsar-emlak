import { LogoIcon } from "./icons";
import { setLanguage, type Language } from "../data/language";

interface LanguageSelectScreenProps {
  /** The previously chosen language, highlighted so a returning player can just tap it again. Undefined on first install. */
  current?: Language;
  onChosen: (lang: Language) => void;
}

const options: { id: Language; flag: string; label: string }[] = [
  { id: "tr", flag: "🇹🇷", label: "Türkçe" },
  { id: "en", flag: "🇬🇧", label: "English" },
];

export default function LanguageSelectScreen({ current, onChosen }: LanguageSelectScreenProps) {
  function choose(lang: Language) {
    setLanguage(lang);
    onChosen(lang);
  }

  return (
    <div className="menu-screen">
      <div className="menu-title-block">
        <LogoIcon size={56} className="app-logo" />
        <h1 className="menu-title">Odd Estate</h1>
        <p className="menu-subtitle">Dil seçin / Choose your language</p>
      </div>
      <nav className="language-select-options">
        {options.map((o) => (
          <button
            key={o.id}
            className={`menu-btn language-select-btn ${current === o.id ? "active" : ""}`}
            onClick={() => choose(o.id)}
          >
            <span className="language-select-flag" aria-hidden>
              {o.flag}
            </span>
            <span>{o.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
