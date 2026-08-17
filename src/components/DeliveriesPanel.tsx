import type { PendingDelivery } from "../types";
import { formatTL } from "../data/economy";

interface DeliveriesPanelProps {
  pendingDeliveries: PendingDelivery[];
  currentDateLabel: string;
}

export default function DeliveriesPanel({ pendingDeliveries, currentDateLabel }: DeliveriesPanelProps) {
  return (
    <div className="portfolio-panel">
      <p className="market-category-title">Bugün: {currentDateLabel}</p>
      {pendingDeliveries.length === 0 && (
        <p className="menu-empty">
          Bekleyen teslim yok — sözleşmede "1 ay sonra" ya da "3 ay sonra" teslim seçildiğinde, kalan ödeme burada görünür.
        </p>
      )}
      {pendingDeliveries.map((d) => (
        <div className="portfolio-row" key={d.id}>
          <div className="portfolio-row-info">
            <p className="portfolio-row-title">{d.houseTitle}</p>
            <p className="portfolio-row-location">Teslim Tarihi: {d.deliveryDateLabel}</p>
          </div>
          <div className="portfolio-row-meta">
            <span className="portfolio-row-status">⏳ {formatTL(d.deferredAmount)} bekliyor</span>
          </div>
        </div>
      ))}
    </div>
  );
}
