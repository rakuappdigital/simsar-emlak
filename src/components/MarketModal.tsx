import { perks } from "../data/perks";
import { formatTL } from "../data/economy";
import { computePrestige, PRESTIGE_MAX } from "../data/scoring";
import type { MarketCategory } from "../types";

interface MarketModalProps {
  balance: number;
  ownedPerks: string[];
  consumables: Record<string, number>;
  unlockedTiers: number[];
  onBuy: (id: string) => void;
  onClose: () => void;
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

export default function MarketModal({
  balance,
  ownedPerks,
  consumables,
  unlockedTiers,
  onBuy,
  onClose,
}: MarketModalProps) {
  return (
    <div className="modal-overlay">
      <div className="market-modal">
        <div className="market-header">
          <h2 className="market-title">Ofis Marketi</h2>
          <span className="market-balance">💰 {formatTL(balance)}</span>
          <button className="market-close" onClick={onClose} aria-label="Kapat">
            ✕
          </button>
        </div>

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
                const disabled = alreadyOwned || tierAlready || !prereqMet || balance < item.cost;
                return (
                  <div className="market-item" key={item.id}>
                    <div className="market-item-info">
                      <p className="market-item-title">{item.title}</p>
                      <p className="market-item-description">{item.description}</p>
                      {!prereqMet && prereqItem && (
                        <p className="market-item-requires">Önce gerekli: {prereqItem.title}</p>
                      )}
                      {item.consumable && count > 0 && <p className="market-item-count">Elinde: {count}</p>}
                    </div>
                    <button className="pixel-btn small" disabled={disabled} onClick={() => onBuy(item.id)}>
                      {alreadyOwned || tierAlready ? "Alındı ✓" : formatTL(item.cost)}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
