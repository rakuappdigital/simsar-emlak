import { useState } from "react";
import { perks, effectiveCost, CAMPAIGN_PERK_ID, isCampaignWeek } from "../data/perks";
import { formatTL } from "../data/economy";
import { computePrestige, PRESTIGE_MAX } from "../data/scoring";
import { countOwnedOfisItems } from "../data/officeImages";
import type { HouseResult, MarketCategory } from "../types";
import { resolveText, t } from "../data/language";
import PurchaseConfirmModal from "./PurchaseConfirmModal";

interface MarketPanelProps {
  balance: number;
  ownedPerks: string[];
  consumables: Record<string, number>;
  unlockedTiers: number[];
  badges: string[];
  weekIndex: number;
  results: HouseResult[];
  onBuy: (id: string) => void;
}

const categoryLabelsByLang: Record<MarketCategory, { tr: string; en: string }> = {
  kilit: { tr: "Portföy Kilidi", en: "Portfolio Lock" },
  ofis: { tr: "Ofis Ekipmanı", en: "Office Equipment" },
  kiyafet: { tr: "Kıyafet", en: "Outfits" },
  sertifika: { tr: "Sertifika", en: "Certificates" },
  arac: { tr: "Araç", en: "Vehicle" },
  sarf: { tr: "Sarf Malzemesi", en: "Consumables" },
};
function categoryLabel(cat: MarketCategory): string {
  return t(categoryLabelsByLang[cat]);
}

const categoryOrder: MarketCategory[] = ["kilit", "ofis", "kiyafet", "sertifika", "arac", "sarf"];

export default function MarketPanel({
  balance,
  ownedPerks,
  consumables,
  unlockedTiers,
  badges,
  weekIndex,
  results,
  onBuy,
}: MarketPanelProps) {
  const campaignActive = isCampaignWeek(weekIndex);
  const soldCount = results.filter((r) => r.outcome === "sold").length;
  const ownedOfisCount = countOwnedOfisItems(ownedPerks);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const pendingItem = pendingItemId ? perks.find((p) => p.id === pendingItemId) : undefined;
  const pendingPrice = pendingItem ? effectiveCost(pendingItem, badges, weekIndex) : 0;
  return (
    <div className="market-panel">
      {campaignActive && (
        <p className="market-campaign-banner">
          🎉 {t({ tr: "Bu hafta kampanya var — Enerji İçeceği indirimli!", en: "There's a campaign this week — Energy Drink is discounted!" })}
        </p>
      )}
      {categoryOrder.map((cat) => {
        const items = perks.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        const prestige = cat === "kiyafet" ? computePrestige(ownedPerks) : null;
        return (
          <div className="market-category" key={cat}>
            <p className="market-category-title">{categoryLabel(cat)}</p>
            {prestige !== null && (
              <div className="prestige-bar">
                <span className="prestige-label">
                  {t({ tr: "Prestij", en: "Prestige" })}: {prestige}/{PRESTIGE_MAX}
                </span>
                <div className="stat-track">
                  <div
                    className="stat-fill prestige-fill"
                    style={{ width: `${Math.min(100, (prestige / PRESTIGE_MAX) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {items.map((item) => {
              const alreadyOwned = !item.consumable && ownedPerks.includes(item.id);
              const count = item.consumable ? (consumables[item.id] ?? 0) : 0;
              const prereqItem = item.requires ? perks.find((p) => p.id === item.requires) : undefined;
              const prereqMet = !item.requires || ownedPerks.includes(item.requires);
              const tierAlready = item.unlocksTier ? unlockedTiers.includes(item.unlocksTier) : false;
              const price = effectiveCost(item, badges, weekIndex);
              const discounted = price < item.cost;
              const isCampaignItem = item.id === CAMPAIGN_PERK_ID && campaignActive;
              const soldCountMet = !item.requiresSoldCount || soldCount >= item.requiresSoldCount;
              const ofisCountMet = !item.requiresOfisItemCount || ownedOfisCount >= item.requiresOfisItemCount;
              const disabled = alreadyOwned || tierAlready || !prereqMet || !soldCountMet || !ofisCountMet || balance < price;
              return (
                <div className="market-item" key={item.id}>
                  <div className="market-item-info">
                    <p className="market-item-title">{resolveText(item.title)}</p>
                    {!prereqMet && prereqItem && (
                      <p className="market-item-requires">
                        {t({ tr: "Önce gerekli", en: "Requires first" })}: {resolveText(prereqItem.title)}
                      </p>
                    )}
                    {prereqMet && !soldCountMet && (
                      <p className="market-item-requires">
                        {t({
                          tr: `Gerekli: en az ${item.requiresSoldCount} satış (şu an ${soldCount})`,
                          en: `Requires: at least ${item.requiresSoldCount} sales (currently ${soldCount})`,
                        })}
                      </p>
                    )}
                    {prereqMet && soldCountMet && !ofisCountMet && (
                      <p className="market-item-requires">
                        {t({
                          tr: `Gerekli: en az ${item.requiresOfisItemCount} ofis eşyası (şu an ${ownedOfisCount})`,
                          en: `Requires: at least ${item.requiresOfisItemCount} office items (currently ${ownedOfisCount})`,
                        })}
                      </p>
                    )}
                    {item.consumable && count > 0 && (
                      <p className="market-item-count">
                        {t({ tr: "Elinde", en: "You have" })}: {count}
                      </p>
                    )}
                    {discounted && !alreadyOwned && (
                      <p className="market-item-discount">
                        {isCampaignItem
                          ? `🎉 ${t({ tr: "Haftalık kampanya indirimi uygulandı", en: "Weekly campaign discount applied" })}`
                          : `🏅 ${t({ tr: "Dürüstlük Serisi indirimi uygulandı", en: "Honesty Streak discount applied" })}`}
                      </p>
                    )}
                  </div>
                  <button className="pixel-btn small" disabled={disabled} onClick={() => setPendingItemId(item.id)}>
                    {alreadyOwned || tierAlready ? (
                      `${t({ tr: "Alındı", en: "Owned" })} ✓`
                    ) : discounted ? (
                      <>
                        <span className="market-item-price-original">{formatTL(item.cost)}</span> {formatTL(price)}
                      </>
                    ) : (
                      formatTL(price)
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
      {pendingItem && (
        <PurchaseConfirmModal
          title={resolveText(pendingItem.title)}
          description={resolveText(pendingItem.description)}
          priceLabel={formatTL(pendingPrice)}
          onCancel={() => setPendingItemId(null)}
          onConfirm={() => {
            onBuy(pendingItem.id);
            setPendingItemId(null);
          }}
        />
      )}
    </div>
  );
}
