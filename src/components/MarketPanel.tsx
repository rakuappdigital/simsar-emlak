import { perks, effectiveCost, CAMPAIGN_PERK_ID, isCampaignWeek } from "../data/perks";
import { formatTL } from "../data/economy";
import { computePrestige, PRESTIGE_MAX } from "../data/scoring";
import { countOwnedOfisItems } from "../data/officeImages";
import type { HouseResult, MarketCategory } from "../types";

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

const categoryLabels: Record<MarketCategory, string> = {
  kilit: "Portföy Kilidi",
  ofis: "Ofis Ekipmanı",
  kiyafet: "Kıyafet",
  sertifika: "Sertifika",
  arac: "Araç",
  sarf: "Sarf Malzemesi",
};

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
  return (
    <div className="market-panel">
      {campaignActive && (
        <p className="market-campaign-banner">🎉 Bu hafta kampanya var — Enerji İçeceği indirimli!</p>
      )}
      {categoryOrder.map((cat) => {
        const items = perks.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        const prestige = cat === "kiyafet" ? computePrestige(ownedPerks) : null;
        return (
          <div className="market-category" key={cat}>
            <p className="market-category-title">{categoryLabels[cat]}</p>
            {prestige !== null && (
              <div className="prestige-bar">
                <span className="prestige-label">Prestij: {prestige}/{PRESTIGE_MAX}</span>
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
                    <p className="market-item-title">{item.title}</p>
                    <p className="market-item-description">{item.description}</p>
                    {!prereqMet && prereqItem && (
                      <p className="market-item-requires">Önce gerekli: {prereqItem.title}</p>
                    )}
                    {prereqMet && !soldCountMet && (
                      <p className="market-item-requires">Gerekli: en az {item.requiresSoldCount} satış (şu an {soldCount})</p>
                    )}
                    {prereqMet && soldCountMet && !ofisCountMet && (
                      <p className="market-item-requires">Gerekli: en az {item.requiresOfisItemCount} ofis eşyası (şu an {ownedOfisCount})</p>
                    )}
                    {item.consumable && count > 0 && <p className="market-item-count">Elinde: {count}</p>}
                    {discounted && !alreadyOwned && (
                      <p className="market-item-discount">
                        {isCampaignItem ? "🎉 Haftalık kampanya indirimi uygulandı" : "🏅 Dürüstlük Serisi indirimi uygulandı"}
                      </p>
                    )}
                  </div>
                  <button className="pixel-btn small" disabled={disabled} onClick={() => onBuy(item.id)}>
                    {alreadyOwned || tierAlready ? (
                      "Alındı ✓"
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
    </div>
  );
}
