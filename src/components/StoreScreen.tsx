import { useState } from "react";
import type { Language } from "../data/language";
import { JETTON_PACKAGES, JETTON_DESCRIPTION, type JettonPackage } from "../data/jettons";
import {
  FULL_UNLOCK_PRICE_TR,
  FULL_UNLOCK_PRICE_INTL,
  FULL_UNLOCK_DESCRIPTION,
  BUNDLE_FULL_JETTON30_PRICE_INTL,
  BUNDLE_FULL_JETTON30_PRICE_TR,
  BUNDLE_FULL_JETTON30_DESCRIPTION,
  BUNDLE_FULL_JETTON30_PRODUCT_ID,
  FULL_UNLOCK_PRODUCT_ID,
} from "../data/purchases";
import { useLivePrices, formatInCurrency } from "../data/livePrices";
import { CoinIcon, UnlockIcon, GiftBundleIcon, CheckIcon } from "./icons";
import GameIcon from "./GameIcon";
/** A store card's details, opened under its row when tapped. */
interface StoreItem {
  icon: string;
  title: string;
  description: string;
  priceLabel: string;
  run: () => Promise<void>;
}

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
  onBuyJetton: (pkg: JettonPackage) => Promise<void>;
  onBuyFullVersion: () => Promise<void>;
  onBuyBundleFullJetton30: () => Promise<void>;
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
  onBuyJetton,
  onBuyFullVersion,
  onBuyBundleFullJetton30,
  onRestorePurchases,
  onBack,
}: StoreScreenProps) {
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  // Descriptions live behind a tap: the tapped card's details open right under its row.
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  async function handleBuyBundle(id: string, action: () => Promise<void>) {
    setBuyingId(id);
    await action();
    setBuyingId(null);
  }

  const jetton50 = JETTON_PACKAGES.find((p) => p.id === "jetton-medium")!;
  // App Store'daki gerçek fiyatlar; gelemezse sabitler (bkz. data/livePrices.ts).
  const live = useLivePrices([FULL_UNLOCK_PRODUCT_ID, BUNDLE_FULL_JETTON30_PRODUCT_ID, ...JETTON_PACKAGES.map((p) => p.productId)]);
  const priceOf = (productId: string, fallback: string) => live[productId]?.label ?? fallback;
  const valueOf = (productId: string, fallback: string) => live[productId]?.value ?? parsePrice(fallback);
  const fullPrice = priceOf(FULL_UNLOCK_PRODUCT_ID, language === "en" ? FULL_UNLOCK_PRICE_INTL : FULL_UNLOCK_PRICE_TR);
  const jettonPrice = (pkg: JettonPackage) => priceOf(pkg.productId, language === "en" ? pkg.priceIntl : pkg.priceTR);

  const bundles = [
    {
      id: "bundle-jetton30",
      name: { tr: "Full + 30 Jetton", en: "Full + 30 Jetton" },
      productId: BUNDLE_FULL_JETTON30_PRODUCT_ID,
      price: { tr: BUNDLE_FULL_JETTON30_PRICE_TR, en: BUNDLE_FULL_JETTON30_PRICE_INTL },
      refComponents: { tr: [FULL_UNLOCK_PRICE_TR, jetton50.priceTR], en: [FULL_UNLOCK_PRICE_INTL, jetton50.priceIntl] },
      refProductIds: [FULL_UNLOCK_PRODUCT_ID, jetton50.productId],
      description: BUNDLE_FULL_JETTON30_DESCRIPTION,
      onBuy: onBuyBundleFullJetton30,
      featured: true,
    },
  ];

  function toggleItem(id: string) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  const jettonItems = JETTON_PACKAGES.map((pkg) => ({
    id: pkg.id,
    item: {
      icon: "coin",
      title: `${pkg.amount} Jetton`,
      description: JETTON_DESCRIPTION[language],
      priceLabel: jettonPrice(pkg),
      run: () => handleBuyJetton(pkg),
    },
  }));
  const unlockItems = [
    {
      id: "full-unlock",
      item: {
        icon: "unlock",
        title: language === "en" ? "Full Version" : "Tam Sürüm",
        description: FULL_UNLOCK_DESCRIPTION[language],
        priceLabel: fullPrice,
        run: handleBuyFullVersion,
      },
    },
  ];
  const bundleItems = bundles.map((bundle) => ({
    id: bundle.id,
    item: {
      icon: "gift",
      title: bundle.name[language],
      description: bundle.description[language],
      priceLabel: priceOf(bundle.productId, bundle.price[language]),
      run: () => handleBuyBundle(bundle.id, bundle.onBuy),
    },
  }));

  /** The tapped card's details, opened right under its own row. */
  function inlineDetail(group: { id: string; item: StoreItem }[]) {
    const hit = group.find((g) => g.id === selectedId);
    if (!hit) return null;
    return (
      <div className="store-inline-detail">
        <p className="store-inline-title"><GameIcon name={hit.item.icon} size={14} className="icon-inline" /> {hit.item.title}</p>
        <p className="store-inline-desc">{hit.item.description}</p>
        <button
          className="pixel-btn purchase-confirm-buy"
          onClick={() => {
            setSelectedId(null);
            hit.item.run();
          }}
        >
          {language === "en" ? "Buy" : "Satın Al"} — {hit.item.priceLabel}
        </button>
      </div>
    );
  }

  function cardClass(base: string, id: string) {
    return `${base} ${selectedId === id ? "store-card-selected" : ""}`;
  }

  return (
    <div className="menu-screen">
      <h2 className="menu-section-title">{language === "en" ? "Store" : "Mağaza"}</h2>

      <p className="menu-empty">
        {language === "en" ? "Your balance" : "Bakiyen"}: <strong><CoinIcon size={14} className="icon-inline" /> {jettons}</strong>
      </p>
      <p className="menu-empty">
        {language === "en" ? "Tap an item to see what it includes." : "İçeriğini görmek için bir pakete dokun."}
      </p>
      <div className="day-activity-list day-activity-list-3col">
        {JETTON_PACKAGES.map((pkg) => (
          <button
            key={pkg.id}
            className={cardClass("day-activity-card", pkg.id)}
            onClick={() => toggleItem(pkg.id)}
            disabled={buyingId !== null}
          >
            <span className="day-activity-icon"><CoinIcon size={20} /></span>
            <span className="day-activity-label">{pkg.amount} Jetton</span>
            <span className="day-activity-gain">
              {buyingId === pkg.id ? "…" : jettonPrice(pkg)}
            </span>
          </button>
        ))}
      </div>
      {inlineDetail(jettonItems)}

      <div className="day-activity-list store-center-row">
        <button
          className={cardClass("day-activity-card", "full-unlock")}
          onClick={() => toggleItem("full-unlock")}
          disabled={buyingId !== null || fullUnlocked}
        >
          <span className="day-activity-icon"><UnlockIcon size={20} /></span>
          <span className="day-activity-label">{language === "en" ? "Full Version" : "Tam Sürüm"}</span>
          <span className="day-activity-gain">
            {fullUnlocked ? <CheckIcon size={14} /> : buyingId === "full-unlock" ? "…" : fullPrice}
          </span>
        </button>
      </div>
      {!fullUnlocked && selectedId !== "full-unlock" && (
        <p className="store-full-note">
          {language === "en"
            ? "Full Version also removes the interstitial ads between days. Rewarded ads stay optional."
            : "Tam Sürüm, gün geçişlerindeki geçiş reklamlarını da kaldırır. Ödüllü reklamlar isteğe bağlı kalır."}
        </p>
      )}
      {inlineDetail(unlockItems)}

      {!fullUnlocked && (
        <>
          <p className="settings-subsection-title">
            <GiftBundleIcon size={14} className="icon-inline" /> {language === "en" ? "Starter Bundle" : "Başlangıç Paketi"}
          </p>
          <div className="bundle-grid">
            {bundles.map((bundle) => {
              const refTotal = bundle.refProductIds.reduce((sum, id, k) => sum + valueOf(id, bundle.refComponents[language][k]), 0);
              const price = priceOf(bundle.productId, bundle.price[language]);
              const savingsPct = Math.round((1 - valueOf(bundle.productId, bundle.price[language]) / refTotal) * 100);
              const currency = live[bundle.productId]?.currencyCode;
              return (
                <div key={bundle.id} className="store-bundle-slot">
                  <button
                    className={cardClass(`bundle-card ${bundle.featured ? "featured" : ""}`, bundle.id)}
                    onClick={() => toggleItem(bundle.id)}
                    disabled={buyingId !== null}
                  >
                    {bundle.featured && (
                      <span className="bundle-ribbon">{language === "en" ? "BEST VALUE" : "EN AVANTAJLI"}</span>
                    )}
                    <span className="bundle-icon"><GiftBundleIcon size={32} /></span>
                    <span className="bundle-name">{bundle.name[language]}</span>
                    <span className="bundle-old">{currency ? formatInCurrency(refTotal, currency, language) : formatPrice(refTotal, language)}</span>
                    <span className="bundle-new">{buyingId === bundle.id ? "…" : price}</span>
                    <span className="bundle-save">
                      {language === "en" ? `${savingsPct}% off` : `%${savingsPct} tasarruf`}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          {/* Açıklama kartın dar yuvasında değil, ızgaranın altında tam genişlikte açılır (diğer gruplar gibi). */}
          {inlineDetail(bundleItems)}
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
