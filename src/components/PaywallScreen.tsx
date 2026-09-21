import { useState } from "react";
import { LogoIcon } from "./icons";
import { FULL_UNLOCK_PRICE_TR, FULL_UNLOCK_PRICE_INTL, FULL_UNLOCK_DESCRIPTION, purchaseFullUnlock } from "../data/purchases";
import type { Language } from "../data/language";

interface PaywallScreenProps {
  language: Language;
  onUnlocked: () => void;
  onBack: () => void;
}

const strings = {
  title: { tr: "Demo Sona Erdi", en: "Demo Complete" },
  buy: { tr: "Tam Sürümü Satın Al", en: "Unlock Full Version" },
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
    <div className="menu-screen">
      <div className="menu-title-block">
        <LogoIcon size={56} className="app-logo" />
        <h1 className="menu-title">{strings.title[language]}</h1>
        <p className="menu-subtitle">{FULL_UNLOCK_DESCRIPTION[language]}</p>
      </div>
      <nav className="menu-buttons">
        <button className="menu-btn" onClick={handleBuy} disabled={buying}>
          {buying ? strings.buying[language] : `${strings.buy[language]} — ${price}`}
        </button>
        <button className="menu-btn ghost" onClick={onBack} disabled={buying}>
          {strings.back[language]}
        </button>
      </nav>
    </div>
  );
}
