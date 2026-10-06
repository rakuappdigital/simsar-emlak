import { useState } from "react";
import { LogoIcon } from "./icons";
import GameIcon from "./GameIcon";
import { FULL_UNLOCK_PRICE_TR, FULL_UNLOCK_PRICE_INTL, FULL_UNLOCK_FEATURES, purchaseFullUnlock } from "../data/purchases";
import type { Language } from "../data/language";

interface PaywallScreenProps {
  language: Language;
  onUnlocked: () => void;
  onBack: () => void;
}

const strings = {
  title: { tr: "Demo Sona Erdi", en: "Demo Complete" },
  lead: {
    tr: "Emlah'ın hikâyesi daha yeni başlıyor. Tam Sürümde seni neler bekliyor:",
    en: "Estetan's story is only getting started. Here's what the Full Version adds:",
  },
  buy: { tr: "Tam Sürümü Aç", en: "Unlock Full Version" },
  buying: { tr: "İşleniyor…", en: "Processing…" },
  back: { tr: "Ana Menüye Dön", en: "Back to Menu" },
};

export default function PaywallScreen({ language, onUnlocked, onBack }: PaywallScreenProps) {
  const [buying, setBuying] = useState(false);
  const price = language === "en" ? FULL_UNLOCK_PRICE_INTL : FULL_UNLOCK_PRICE_TR;

  async function handleBuy() {
    setBuying(true);
    const ok = await purchaseFullUnlock();
    setBuying(false);
    if (ok) onUnlocked();
  }

  return (
    <div className="menu-screen paywall-screen">
      <div className="menu-title-block">
        <LogoIcon size={56} className="app-logo" />
        <h1 className="menu-title">{strings.title[language]}</h1>
        <p className="menu-subtitle">{strings.lead[language]}</p>
      </div>
      <ul className="paywall-features">
        {FULL_UNLOCK_FEATURES.map((f) => (
          <li key={f.icon} className="paywall-feature">
            <span className="paywall-feature-icon" aria-hidden><GameIcon name={f.icon} size={22} /></span>
            <span className="paywall-feature-body">
              <strong className="paywall-feature-title">{f.title[language]}</strong>
              <span className="paywall-feature-text">{f.text[language]}</span>
            </span>
          </li>
        ))}
      </ul>
      <nav className="menu-buttons">
        <button className="menu-btn paywall-buy" onClick={handleBuy} disabled={buying}>
          {buying ? strings.buying[language] : `${strings.buy[language]} — ${price}`}
        </button>
        <button className="menu-btn ghost" onClick={onBack} disabled={buying}>
          {strings.back[language]}
        </button>
      </nav>
    </div>
  );
}
