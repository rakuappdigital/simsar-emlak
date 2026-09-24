import type { ContactedCustomer, HouseResult, HouseScene, OwnedInvestmentHouse, SceneOutcome } from "../types";
import { formatTL } from "../data/economy";
import { conditionLabel, renovationOptions, renovationCost, type RenovationLevel } from "../data/renovation";
import { resolveText, resolveHouseTitle, resolveHouseLocation, t } from "../data/language";

interface InvestmentPanelProps {
  balance: number;
  investmentHouses: HouseScene[];
  investmentUnlocked: boolean;
  ownedInvestmentHouses: OwnedInvestmentHouse[];
  investmentResults: HouseResult[];
  currentNewsModifier: number;
  onBuyInvestment: (houseId: string) => void;
  onSellInvestment: (houseId: string) => void;
  onRenovate: (houseId: string, level: RenovationLevel) => void;
  contactedCustomers: ContactedCustomer[];
  onPitchInvestment: (contact: ContactedCustomer, houseId: string) => void;
}

function outcomeLabel(outcome: SceneOutcome): string {
  if (outcome === "sold") return `${t({ tr: "Satıldı", en: "Sold" })} ✅`;
  if (outcome === "thinking") return `${t({ tr: "Düşünüyor", en: "Thinking" })} 🤔`;
  return `${t({ tr: "Kaybedildi", en: "Lost" })} ❌`;
}

export default function InvestmentPanel({
  balance,
  investmentHouses,
  investmentUnlocked,
  ownedInvestmentHouses,
  investmentResults,
  currentNewsModifier,
  onBuyInvestment,
  onSellInvestment,
  onRenovate,
  contactedCustomers,
  onPitchInvestment,
}: InvestmentPanelProps) {
  if (!investmentUnlocked) {
    return (
      <div className="portfolio-panel">
        <p className="menu-empty">
          {t({
            tr: 'Bu bölüm "Ofis Ortağı" rütbesine ulaşınca açılır — kendi paranla ev alıp elinde tutmadan satabileceksin.',
            en: 'This section unlocks once you reach "Office Partner" rank — you\'ll be able to buy houses with your own money and sell them for a profit.',
          })}
        </p>
      </div>
    );
  }

  const ownedIds = new Set(ownedInvestmentHouses.map((o) => o.houseId));
  const available = investmentHouses.filter((h) => !ownedIds.has(h.id));

  return (
    <div className="portfolio-panel">
      {currentNewsModifier !== 0 && (
        <p className={`market-campaign-banner ${currentNewsModifier > 0 ? "news-up" : "news-down"}`}>
          {currentNewsModifier > 0
            ? t({
                tr: `📈 Piyasa yükselişte — fiyatlar %${Math.round(currentNewsModifier * 100)} yukarıda.`,
                en: `📈 The market is up — prices are ${Math.round(currentNewsModifier * 100)}% higher.`,
              })
            : t({
                tr: `📉 Piyasa düşüşte — fiyatlar %${Math.round(Math.abs(currentNewsModifier) * 100)} aşağıda, satışta pazarlık daha sert geçebilir.`,
                en: `📉 The market is down — prices are ${Math.round(Math.abs(currentNewsModifier) * 100)}% lower, negotiating a sale may be tougher.`,
              })}
        </p>
      )}

      <p className="market-category-title">{t({ tr: "Sahip Olduklarım", en: "What I Own" })}</p>
      {ownedInvestmentHouses.length === 0 && (
        <p className="menu-empty">{t({ tr: "Henüz satın aldığın bir yatırım evi yok.", en: "You haven't bought any investment property yet." })}</p>
      )}
      {ownedInvestmentHouses.map((owned) => {
        const houseDef = investmentHouses.find((h) => h.id === owned.houseId);
        if (!houseDef) return null;
        return (
          <div className="portfolio-row" key={owned.houseId}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">{resolveHouseTitle(houseDef)}</p>
              <p className="portfolio-row-location">{resolveHouseLocation(houseDef)}</p>
              <p className="portfolio-row-location">
                {t({ tr: "Alış", en: "Purchase" })}: {formatTL(owned.purchasePrice)}
              </p>
              <p className={`condition-tag condition-${owned.condition}`}>🔧 {resolveText(conditionLabel[owned.condition])}</p>
              {owned.renovationLevel === "yok" ? (
                <div className="renovation-options">
                  {renovationOptions.map((opt) => {
                    const cost = renovationCost(opt.level, owned.purchasePrice);
                    return (
                      <button
                        key={opt.level}
                        className="pixel-btn small ghost"
                        disabled={balance < cost}
                        onClick={() => onRenovate(owned.houseId, opt.level)}
                      >
                        {resolveText(opt.label)} ({formatTL(cost)})
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="renovation-done-tag">
                  ✅{" "}
                  {t({
                    tr: `${resolveText(renovationOptions.find((o) => o.level === owned.renovationLevel)?.label ?? "")} yapıldı`,
                    en: `${resolveText(renovationOptions.find((o) => o.level === owned.renovationLevel)?.label ?? "")} done`,
                  })}
                </p>
              )}
              {contactedCustomers.length > 0 && (
                <div className="investment-pitch-list">
                  {contactedCustomers.slice(0, 3).map((c) => (
                    <button
                      key={c.characterId}
                      className="pixel-btn small ghost"
                      onClick={() => onPitchInvestment(c, owned.houseId)}
                    >
                      {t({ tr: `${c.name}'e öner`, en: `Suggest to ${c.name}` })}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="portfolio-row-meta">
              <button className="pixel-btn small" onClick={() => onSellInvestment(owned.houseId)}>
                {t({ tr: "Satışa Çıkar", en: "Put Up for Sale" })}
              </button>
            </div>
          </div>
        );
      })}

      <p className="market-category-title">{t({ tr: "Satın Alınabilir", en: "Available to Buy" })}</p>
      {available.map((houseDef) => {
        const price = Math.round(houseDef.askingPrice * (1 + currentNewsModifier));
        const disabled = balance < price;
        const discounted = currentNewsModifier < 0;
        return (
          <div className="portfolio-row" key={houseDef.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">{resolveHouseTitle(houseDef)}</p>
              <p className="portfolio-row-location">{resolveHouseLocation(houseDef)}</p>
            </div>
            <div className="portfolio-row-meta">
              <button className="pixel-btn small" disabled={disabled} onClick={() => onBuyInvestment(houseDef.id)}>
                {discounted ? (
                  <>
                    <span className="market-item-price-original">{formatTL(houseDef.askingPrice)}</span> {formatTL(price)}
                  </>
                ) : (
                  formatTL(price)
                )}
              </button>
              {discounted && (
                <p className="market-item-discount">
                  ⚠️ {t({ tr: "Fiyat düşük ama satarken zorlanabilirsin", en: "Price is low but you may struggle to sell later" })}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {investmentResults.length > 0 && (
        <>
          <p className="market-category-title">{t({ tr: "Geçmiş Satışlar", en: "Past Sales" })}</p>
          {investmentResults.map((r, i) => {
            const houseDef = investmentHouses.find((h) => h.id === r.houseId);
            return (
              <div className="portfolio-row" key={`${r.houseId}-${i}`}>
                <div className="portfolio-row-info">
                  <p className="portfolio-row-title">{houseDef ? resolveHouseTitle(houseDef) : r.houseId}</p>
                </div>
                <div className="portfolio-row-meta">
                  <span className="portfolio-row-status">
                    {outcomeLabel(r.outcome)}
                    {r.sale && ` (${formatTL(r.sale.commission)} ${t({ tr: "kâr", en: "profit" })})`}
                  </span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
