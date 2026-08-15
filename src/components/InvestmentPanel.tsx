import type { ContactedCustomer, HouseResult, HouseScene, OwnedInvestmentHouse, SceneOutcome } from "../types";
import { formatTL } from "../data/economy";

interface InvestmentPanelProps {
  balance: number;
  investmentHouses: HouseScene[];
  investmentUnlocked: boolean;
  ownedInvestmentHouses: OwnedInvestmentHouse[];
  investmentResults: HouseResult[];
  currentNewsModifier: number;
  onBuyInvestment: (houseId: string) => void;
  onSellInvestment: (houseId: string) => void;
  contactedCustomers: ContactedCustomer[];
  onPitchInvestment: (contact: ContactedCustomer, houseId: string) => void;
}

const outcomeLabel: Record<SceneOutcome, string> = {
  sold: "Satıldı ✅",
  thinking: "Düşünüyor 🤔",
  lost: "Kaybedildi ❌",
};

export default function InvestmentPanel({
  balance,
  investmentHouses,
  investmentUnlocked,
  ownedInvestmentHouses,
  investmentResults,
  currentNewsModifier,
  onBuyInvestment,
  onSellInvestment,
  contactedCustomers,
  onPitchInvestment,
}: InvestmentPanelProps) {
  if (!investmentUnlocked) {
    return (
      <div className="portfolio-panel">
        <p className="menu-empty">
          Bu bölüm "Ofis Ortağı" rütbesine ulaşınca açılır — kendi paranla ev alıp elinde tutmadan satabileceksin.
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
            ? `📈 Piyasa yükselişte — fiyatlar %${Math.round(currentNewsModifier * 100)} yukarıda.`
            : `📉 Piyasa düşüşte — fiyatlar %${Math.round(Math.abs(currentNewsModifier) * 100)} aşağıda, satışta pazarlık daha sert geçebilir.`}
        </p>
      )}

      <p className="market-category-title">Sahip Olduklarım</p>
      {ownedInvestmentHouses.length === 0 && <p className="menu-empty">Henüz satın aldığın bir yatırım evi yok.</p>}
      {ownedInvestmentHouses.map((owned) => {
        const houseDef = investmentHouses.find((h) => h.id === owned.houseId);
        if (!houseDef) return null;
        return (
          <div className="portfolio-row" key={owned.houseId}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">{houseDef.title}</p>
              <p className="portfolio-row-location">{houseDef.location}</p>
              <p className="portfolio-row-location">Alış: {formatTL(owned.purchasePrice)}</p>
              {contactedCustomers.length > 0 && (
                <div className="investment-pitch-list">
                  {contactedCustomers.slice(0, 3).map((c) => (
                    <button
                      key={c.characterId}
                      className="pixel-btn small ghost"
                      onClick={() => onPitchInvestment(c, owned.houseId)}
                    >
                      {c.name}'e öner
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="portfolio-row-meta">
              <button className="pixel-btn small" onClick={() => onSellInvestment(owned.houseId)}>
                Satışa Çıkar
              </button>
            </div>
          </div>
        );
      })}

      <p className="market-category-title">Satın Alınabilir</p>
      {available.map((houseDef) => {
        const price = Math.round(houseDef.askingPrice * (1 + currentNewsModifier));
        const disabled = balance < price;
        const discounted = currentNewsModifier < 0;
        return (
          <div className="portfolio-row" key={houseDef.id}>
            <div className="portfolio-row-info">
              <p className="portfolio-row-title">{houseDef.title}</p>
              <p className="portfolio-row-location">{houseDef.location}</p>
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
            </div>
          </div>
        );
      })}

      {investmentResults.length > 0 && (
        <>
          <p className="market-category-title">Geçmiş Satışlar</p>
          {investmentResults.map((r, i) => {
            const houseDef = investmentHouses.find((h) => h.id === r.houseId);
            return (
              <div className="portfolio-row" key={`${r.houseId}-${i}`}>
                <div className="portfolio-row-info">
                  <p className="portfolio-row-title">{houseDef?.title ?? r.houseId}</p>
                </div>
                <div className="portfolio-row-meta">
                  <span className="portfolio-row-status">
                    {outcomeLabel[r.outcome]}
                    {r.sale && ` (${formatTL(r.sale.commission)} kâr)`}
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
