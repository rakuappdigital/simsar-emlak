import { useState } from "react";
import { getSfxVolume, getMusicVolume, setSfxVolume, setMusicVolume, startMusic, stopMusic, playClick } from "../data/sound";
import { getDifficulty, setDifficulty, difficultyLabels, type Difficulty } from "../data/difficulty";
import { setLanguage as persistLanguage, resolveText, type Language } from "../data/language";
import oddEstateLogo from "../assets/branding/oddestate-logo.png";
import { HeartIcon, ShopBagIcon } from "./icons";
import { FlagTrIcon, FlagGbIcon } from "./icons";

interface SettingsScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  /** true once a run is in progress — dialogue/customer text is already committed to this language, so switching mid-game would mix languages. */
  languageLocked: boolean;
  onOpenStore: () => void;
  /** Only passed mid-run — ends the session and returns to the main menu (progress stays at the last autosave). */
  onExitGame?: () => void;
  onBack: () => void;
}

const languages: { id: Language; label: string }[] = [
  { id: "en", label: "English" },
  { id: "tr", label: "Türkçe" },
];

const difficulties: Difficulty[] = ["kolay", "normal", "zor"];

const aboutText = {
  tr: "Odd Estate büyük bir stüdyo değil — tek bir bağımsız geliştirici tarafından, boş zamanlarda ve sevgiyle yapılıyor. Oyunu beğendiysen, desteğin (bir yorum ya da mağazadaki bir paket) bu projenin büyümesine gerçekten yardımcı oluyor. Her güncelleme sizin geri bildirimlerinizle şekilleniyor.",
  en: "Odd Estate isn't made by a big studio — it's built by one independent developer, in spare time, with a lot of care. If you're enjoying it, your support (a review, or one of the store packs) genuinely helps this project keep growing. Every update is shaped by player feedback.",
};

/**
 * Single settings screen with room to grow: each future setting gets its
 * own "menu-section-title" block below Ses, not a whole new menu stage.
 */
export default function SettingsScreen({
  language,
  onLanguageChange,
  languageLocked,
  onOpenStore,
  onExitGame,
  onBack,
}: SettingsScreenProps) {
  const [music, setMusic] = useState(getMusicVolume);
  const [sfx, setSfx] = useState(getSfxVolume);
  const [difficulty, setDifficultyState] = useState(getDifficulty);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

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
      <img src={oddEstateLogo} alt="Odd Estate" className="settings-logo" />
      <h2 className="menu-section-title">Ayarlar / Settings</h2>

      <p className="settings-subsection-title">Dil / Language</p>
      <div className="difficulty-row">
        {languages.map((l) => (
          <button
            key={l.id}
            className={`difficulty-btn ${language === l.id ? "active" : ""}`}
            disabled={languageLocked && language !== l.id}
            onClick={() => {
              if (languageLocked) return;
              persistLanguage(l.id);
              onLanguageChange(l.id);
            }}
          >
            {l.id === "tr" ? <FlagTrIcon size={16} className="icon-inline" /> : <FlagGbIcon size={16} className="icon-inline" />} {l.label}
          </button>
        ))}
      </div>
      {languageLocked && (
        <p className="rehber-note">
          {language === "en"
            ? "Language is locked once a run has started — start a new game to change it."
            : "Bir tur başladıktan sonra dil değiştirilemez — değiştirmek için yeni oyun başlatman gerekir."}
        </p>
      )}

      <p className="settings-subsection-title">{language === "en" ? "Sound" : "Ses"}</p>
      <div className="sound-row">
        <span>{language === "en" ? "Music" : "Müzik"}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={music}
          onChange={(e) => handleMusicChange(Number(e.target.value))}
        />
      </div>
      <div className="sound-row">
        <span>{language === "en" ? "Effects" : "Efektler"}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={sfx}
          onChange={(e) => handleSfxChange(Number(e.target.value))}
          onMouseUp={() => playClick()}
        />
      </div>

      <p className="settings-subsection-title">{language === "en" ? "Difficulty" : "Zorluk"}</p>
      <div className="difficulty-row">
        {difficulties.map((d) => (
          <button
            key={d}
            className={`difficulty-btn ${difficulty === d ? "active" : ""}`}
            onClick={() => handleDifficultyChange(d)}
          >
            {resolveText(difficultyLabels[d])}
          </button>
        ))}
      </div>
      <p className="menu-empty">
        {language === "en"
          ? "Affects how quickly suspicion rises. Normal is the game's usual balance."
          : "Şüphenin ne kadar hızlı arttığını etkiler. Normal, oyunun her zamanki dengesidir."}
      </p>

      <p className="settings-subsection-title">{language === "en" ? "Store" : "Mağaza"}</p>
      <button className="menu-btn" onClick={onOpenStore}>
        <ShopBagIcon size={16} className="icon-inline" /> {language === "en" ? "Store" : "Mağaza"}
      </button>

      <button className={`about-toggle ${aboutOpen ? "open" : ""}`} onClick={() => setAboutOpen((o) => !o)} aria-expanded={aboutOpen}>
        <HeartIcon size={16} className="about-heart" />
        <span className="about-toggle-label">{language === "en" ? "About" : "Hakkında"}</span>
        <span className="about-chevron">▾</span>
      </button>
      {aboutOpen && (
        <div className="about-card">
          <div className="about-header">
            <span className="about-label">{language === "en" ? "About" : "Hakkında"}</span>
            <span className="about-version">v1.0</span>
          </div>
          <p className="about-body">{aboutText[language]}</p>
          <p className="about-signoff">{language === "en" ? "— with love, your developer" : "— sevgiyle, geliştiricin"}</p>
        </div>
      )}

      {onExitGame && (
        <>
          <p className="settings-subsection-title">{language === "en" ? "Game" : "Oyun"}</p>
          {confirmExit ? (
            <>
              <p className="rehber-note">
                {language === "en"
                  ? "Return to the main menu? Your progress is kept up to the last autosave — you can continue from Saved Games."
                  : "Ana menüye dönülsün mü? İlerlemen son otomatik kayda kadar saklanır — Kayıtlı Oyunlar'dan devam edebilirsin."}
              </p>
              <div className="difficulty-row">
                <button className="difficulty-btn settings-exit-btn" onClick={onExitGame}>
                  {language === "en" ? "Yes, End Game" : "Evet, Bitir"}
                </button>
                <button className="difficulty-btn" onClick={() => setConfirmExit(false)}>
                  {language === "en" ? "Cancel" : "Vazgeç"}
                </button>
              </div>
            </>
          ) : (
            <button className="menu-btn settings-exit-btn" onClick={() => setConfirmExit(true)}>
              {language === "en" ? "End Game" : "Oyunu Bitir"}
            </button>
          )}
        </>
      )}

      <button className="menu-btn ghost" onClick={onBack}>
        {language === "en" ? "Back" : "Geri"}
      </button>
    </div>
  );
}
