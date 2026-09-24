import { useState } from "react";
import { getSfxVolume, getMusicVolume, setSfxVolume, setMusicVolume, startMusic, stopMusic, playClick } from "../data/sound";
import { getDifficulty, setDifficulty, difficultyLabels, type Difficulty } from "../data/difficulty";
import { setLanguage as persistLanguage, resolveText, type Language } from "../data/language";
import { JETTON_PACKAGES, JETTON_DESCRIPTION, type JettonPackage } from "../data/jettons";
import {
  FULL_UNLOCK_PRICE_TR,
  FULL_UNLOCK_PRICE_INTL,
  FULL_UNLOCK_DESCRIPTION,
  REMOVE_ADS_PRICE_TR,
  REMOVE_ADS_PRICE_INTL,
  REMOVE_ADS_DESCRIPTION,
  BUNDLE_FULL_JETTON30_PRICE_INTL,
  BUNDLE_FULL_JETTON30_PRICE_TR,
  BUNDLE_FULL_JETTON30_DESCRIPTION,
  BUNDLE_FULL_NOADS_PRICE_INTL,
  BUNDLE_FULL_NOADS_PRICE_TR,
  BUNDLE_FULL_NOADS_DESCRIPTION,
  BUNDLE_FULL_NOADS_JETTON30_PRICE_INTL,
  BUNDLE_FULL_NOADS_JETTON30_PRICE_TR,
  BUNDLE_FULL_NOADS_JETTON30_DESCRIPTION,
} from "../data/purchases";
import oddEstateLogo from "../assets/branding/oddestate-logo.png";

interface SettingsScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  jettons: number;
  fullUnlocked: boolean;
  adsRemoved: boolean;
  onBuyJetton: (pkg: JettonPackage) => Promise<void>;
  onBuyFullVersion: () => Promise<void>;
  onBuyRemoveAds: () => Promise<void>;
  onBuyBundleFullJetton30: () => Promise<void>;
  onBuyBundleFullNoAds: () => Promise<void>;
  onBuyBundleFullNoAdsJetton30: () => Promise<void>;
  onRestorePurchases: () => Promise<void>;
  onBack: () => void;
}

const languages: { id: Language; label: string }[] = [
  { id: "en", label: "🇬🇧 English" },
  { id: "tr", label: "🇹🇷 Türkçe" },
];

const difficulties: Difficulty[] = ["kolay", "normal", "zor"];

/**
 * Single settings screen with room to grow: each future setting gets its
 * own "menu-section-title" block below Ses, not a whole new menu stage.
 */
export default function SettingsScreen({
  language,
  onLanguageChange,
  jettons,
  fullUnlocked,
  adsRemoved,
  onBuyJetton,
  onBuyFullVersion,
  onBuyRemoveAds,
  onBuyBundleFullJetton30,
  onBuyBundleFullNoAds,
  onBuyBundleFullNoAdsJetton30,
  onRestorePurchases,
  onBack,
}: SettingsScreenProps) {
  const [music, setMusic] = useState(getMusicVolume);
  const [sfx, setSfx] = useState(getSfxVolume);
  const [difficulty, setDifficultyState] = useState(getDifficulty);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  async function handleRestore() {
    setRestoring(true);
    await onRestorePurchases();
    setRestoring(false);
  }

  async function handleBuyJetton(pkg: JettonPackage) {
    setBuyingId(pkg.id);
    await onBuyJetton(pkg);
    setBuyingId(null);
  }

  async function handleBuyFullVersion() {
    setBuyingId("full-unlock");
    await onBuyFullVersion();
    setBuyingId(null);
  }

  async function handleBuyRemoveAds() {
    setBuyingId("remove-ads");
    await onBuyRemoveAds();
    setBuyingId(null);
  }

  async function handleBuyBundle(id: string, action: () => Promise<void>) {
    setBuyingId(id);
    await action();
    setBuyingId(null);
  }

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
            onClick={() => {
              persistLanguage(l.id);
              onLanguageChange(l.id);
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

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

      <p className="settings-subsection-title">🏪 Store / Market</p>
      <p className="menu-empty">
        {language === "en" ? "Your balance" : "Bakiyen"}: <strong>🪙 {jettons}</strong>
      </p>
      <p className="menu-empty">{JETTON_DESCRIPTION[language]}</p>
      <div className="day-activity-list day-activity-list-3col">
        {JETTON_PACKAGES.map((pkg) => (
          <button
            key={pkg.id}
            className="day-activity-card"
            onClick={() => handleBuyJetton(pkg)}
            disabled={buyingId !== null}
          >
            <span className="day-activity-icon">🪙</span>
            <span className="day-activity-label">{pkg.amount} Jetton</span>
            <span className="day-activity-gain">
              {buyingId === pkg.id ? "…" : language === "en" ? pkg.priceIntl : pkg.priceTR}
            </span>
          </button>
        ))}
      </div>

      <div className="day-activity-list">
        <button className="day-activity-card" onClick={handleBuyFullVersion} disabled={buyingId !== null || fullUnlocked}>
          <span className="day-activity-icon">🔓</span>
          <span className="day-activity-label">{language === "en" ? "Full Version" : "Tam Sürüm"}</span>
          <span className="day-activity-gain">
            {fullUnlocked ? "✅" : buyingId === "full-unlock" ? "…" : language === "en" ? FULL_UNLOCK_PRICE_INTL : FULL_UNLOCK_PRICE_TR}
          </span>
        </button>
        <button className="day-activity-card" onClick={handleBuyRemoveAds} disabled={buyingId !== null || adsRemoved}>
          <span className="day-activity-icon">🚫</span>
          <span className="day-activity-label">{language === "en" ? "Remove Ads" : "Reklamları Kaldır"}</span>
          <span className="day-activity-gain">
            {adsRemoved ? "✅" : buyingId === "remove-ads" ? "…" : language === "en" ? REMOVE_ADS_PRICE_INTL : REMOVE_ADS_PRICE_TR}
          </span>
        </button>
      </div>
      <p className="menu-empty">{FULL_UNLOCK_DESCRIPTION[language]}</p>
      <p className="menu-empty">{REMOVE_ADS_DESCRIPTION[language]}</p>

      {!fullUnlocked && (
        <>
          <p className="settings-subsection-title">🎁 {language === "en" ? "Starter Bundles" : "Başlangıç Paketleri"}</p>
          <div className="day-activity-list">
            <button
              className="day-activity-card"
              onClick={() => handleBuyBundle("bundle-jetton30", onBuyBundleFullJetton30)}
              disabled={buyingId !== null}
            >
              <span className="day-activity-icon">🔓🪙</span>
              <span className="day-activity-label">{language === "en" ? "Full + 30 Jetton" : "Full + 30 Jetton"}</span>
              <span className="day-activity-gain">
                {buyingId === "bundle-jetton30" ? "…" : language === "en" ? BUNDLE_FULL_JETTON30_PRICE_INTL : BUNDLE_FULL_JETTON30_PRICE_TR}
              </span>
            </button>
            <button
              className="day-activity-card"
              onClick={() => handleBuyBundle("bundle-noads", onBuyBundleFullNoAds)}
              disabled={buyingId !== null}
            >
              <span className="day-activity-icon">🔓🚫</span>
              <span className="day-activity-label">{language === "en" ? "Full + No Ads" : "Full + Reklamsız"}</span>
              <span className="day-activity-gain">
                {buyingId === "bundle-noads" ? "…" : language === "en" ? BUNDLE_FULL_NOADS_PRICE_INTL : BUNDLE_FULL_NOADS_PRICE_TR}
              </span>
            </button>
            <button
              className="day-activity-card"
              onClick={() => handleBuyBundle("bundle-noads-jetton30", onBuyBundleFullNoAdsJetton30)}
              disabled={buyingId !== null}
            >
              <span className="day-activity-icon">🔓🚫🪙</span>
              <span className="day-activity-label">{language === "en" ? "Full + No Ads + 30 Jetton" : "Full + Reklamsız + 30 Jetton"}</span>
              <span className="day-activity-gain">
                {buyingId === "bundle-noads-jetton30"
                  ? "…"
                  : language === "en"
                    ? BUNDLE_FULL_NOADS_JETTON30_PRICE_INTL
                    : BUNDLE_FULL_NOADS_JETTON30_PRICE_TR}
              </span>
            </button>
          </div>
          <p className="menu-empty">{BUNDLE_FULL_JETTON30_DESCRIPTION[language]}</p>
          <p className="menu-empty">{BUNDLE_FULL_NOADS_DESCRIPTION[language]}</p>
          <p className="menu-empty">{BUNDLE_FULL_NOADS_JETTON30_DESCRIPTION[language]}</p>
        </>
      )}

      <button className="menu-btn ghost" onClick={handleRestore} disabled={restoring}>
        {restoring ? "…" : language === "en" ? "Restore Purchases" : "Satın Alımları Geri Yükle"}
      </button>

      <button className="menu-btn ghost" onClick={onBack}>
        {language === "en" ? "Back" : "Geri"}
      </button>
    </div>
  );
}
