import { useState } from "react";
import type { Language } from "../data/language";
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
import { CoinIcon, UnlockIcon, NoAdsIcon, GiftBundleIcon } from "./icons";

/** Parses a "₺39,99" or "$2.99" price string into a plain number, regardless of locale decimal separator. */
function parsePrice(price: string): number {
  const cleaned = price.replace(/[^\d,.-]/g, "");
  return parseFloat(cleaned.includes(",") ? cleaned.replace(",", ".") : cleaned);
}

function formatPrice(value: number, language: Language): string {
  const rounded = Math.round(value * 100) / 100;
  return language === "en" ? `$${rounded.toFixed(2)}` : `₺${rounded.toFixed(2).replace(".", ",")}`;
}

interface StoreScreenProps {
  language: Language;
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

/**
 * Real-money purchase screen — split out from SettingsScreen so "Market"/"Store"
 * is its own destination instead of living inline under Settings.
 */
export default function StoreScreen({
  language,
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
}: StoreScreenProps) {
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

  const jetton50 = JETTON_PACKAGES.find((p) => p.id === "jetton-medium")!;

  const bundles = [
    {
      id: "bundle-jetton30",
      name: { tr: "Full + 30 Jetton", en: "Full + 30 Jetton" },
      price: { tr: BUNDLE_FULL_JETTON30_PRICE_TR, en: BUNDLE_FULL_JETTON30_PRICE_INTL },
      refComponents: { tr: [FULL_UNLOCK_PRICE_TR, jetton50.priceTR], en: [FULL_UNLOCK_PRICE_INTL, jetton50.priceIntl] },
      description: BUNDLE_FULL_JETTON30_DESCRIPTION,
      onBuy: onBuyBundleFullJetton30,
      featured: false,
    },
    {
      id: "bundle-noads",
      name: { tr: "Full + Reklamsız", en: "Full + No Ads" },
      price: { tr: BUNDLE_FULL_NOADS_PRICE_TR, en: BUNDLE_FULL_NOADS_PRICE_INTL },
      refComponents: { tr: [FULL_UNLOCK_PRICE_TR, REMOVE_ADS_PRICE_TR], en: [FULL_UNLOCK_PRICE_INTL, REMOVE_ADS_PRICE_INTL] },
      description: BUNDLE_FULL_NOADS_DESCRIPTION,
      onBuy: onBuyBundleFullNoAds,
      featured: false,
    },
    {
      id: "bundle-noads-jetton30",
      name: { tr: "Full + Reklamsız + 30 Jetton", en: "Full + No Ads + 30 Jetton" },
      price: { tr: BUNDLE_FULL_NOADS_JETTON30_PRICE_TR, en: BUNDLE_FULL_NOADS_JETTON30_PRICE_INTL },
      refComponents: {
        tr: [FULL_UNLOCK_PRICE_TR, REMOVE_ADS_PRICE_TR, jetton50.priceTR],
        en: [FULL_UNLOCK_PRICE_INTL, REMOVE_ADS_PRICE_INTL, jetton50.priceIntl],
      },
      description: BUNDLE_FULL_NOADS_JETTON30_DESCRIPTION,
      onBuy: onBuyBundleFullNoAdsJetton30,
      featured: true,
    },
  ];

  return (
    <div className="menu-screen">
      <h2 className="menu-section-title">{language === "en" ? "Store" : "Market"}</h2>

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
            <span className="day-activity-icon"><CoinIcon size={20} /></span>
            <span className="day-activity-label">{pkg.amount} Jetton</span>
            <span className="day-activity-gain">
              {buyingId === pkg.id ? "…" : language === "en" ? pkg.priceIntl : pkg.priceTR}
            </span>
          </button>
        ))}
      </div>

      <div className="day-activity-list">
        <button className="day-activity-card" onClick={handleBuyFullVersion} disabled={buyingId !== null || fullUnlocked}>
          <span className="day-activity-icon"><UnlockIcon size={20} /></span>
          <span className="day-activity-label">{language === "en" ? "Full Version" : "Tam Sürüm"}</span>
          <span className="day-activity-gain">
            {fullUnlocked ? "✅" : buyingId === "full-unlock" ? "…" : language === "en" ? FULL_UNLOCK_PRICE_INTL : FULL_UNLOCK_PRICE_TR}
          </span>
        </button>
        <button className="day-activity-card" onClick={handleBuyRemoveAds} disabled={buyingId !== null || adsRemoved}>
          <span className="day-activity-icon"><NoAdsIcon size={20} /></span>
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
          <p className="settings-subsection-title">
            <GiftBundleIcon size={14} className="icon-inline" /> {language === "en" ? "Starter Bundles" : "Başlangıç Paketleri"}
          </p>
          <div className="bundle-grid">
            {bundles.map((bundle) => {
              const refTotal = bundle.refComponents[language].reduce((sum, p) => sum + parsePrice(p), 0);
              const price = bundle.price[language];
              const savingsPct = Math.round((1 - parsePrice(price) / refTotal) * 100);
              return (
                <button
                  key={bundle.id}
                  className={`bundle-card ${bundle.featured ? "featured" : ""}`}
                  onClick={() => handleBuyBundle(bundle.id, bundle.onBuy)}
                  disabled={buyingId !== null}
                >
                  {bundle.featured && (
                    <span className="bundle-ribbon">{language === "en" ? "BEST VALUE" : "EN AVANTAJLI"}</span>
                  )}
                  <span className="bundle-icon"><GiftBundleIcon size={32} /></span>
                  <span className="bundle-name">{bundle.name[language]}</span>
                  <span className="bundle-old">{formatPrice(refTotal, language)}</span>
                  <span className="bundle-new">{buyingId === bundle.id ? "…" : price}</span>
                  <span className="bundle-save">
                    {language === "en" ? `${savingsPct}% off` : `%${savingsPct} tasarruf`}
                  </span>
                </button>
              );
            })}
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
