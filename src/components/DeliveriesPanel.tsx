import type { PendingDelivery } from "../types";
import { t } from "../data/language";
import { formatTL } from "../data/economy";
import { ClockIcon } from "./icons";

interface DeliveriesPanelProps {
  pendingDeliveries: PendingDelivery[];
  currentDateLabel: string;
}

export default function DeliveriesPanel({ pendingDeliveries, currentDateLabel }: DeliveriesPanelProps) {
  return (
    <div className="portfolio-panel">
      <p className="market-category-title">
        {t({ tr: "Bugün", en: "Today" })}: {currentDateLabel}
      </p>
      {pendingDeliveries.length === 0 && (
        <p className="menu-empty">
          {t({
            tr: 'Bekleyen teslim yok — sözleşmede "1 ay sonra" ya da "3 ay sonra" teslim seçildiğinde, kalan ödeme burada görünür.',
            en: 'No pending deliveries — when "1 month later" or "3 months later" delivery is chosen in a contract, the remaining payment shows up here.',
          })}
        </p>
      )}
      {pendingDeliveries.map((d) => (
        <div className="portfolio-row" key={d.id}>
          <div className="portfolio-row-info">
            <p className="portfolio-row-title">{d.houseTitle}</p>
            <p className="portfolio-row-location">
              {t({ tr: "Teslim Tarihi", en: "Delivery Date" })}: {d.deliveryDateLabel}
            </p>
          </div>
          <div className="portfolio-row-meta">
            <span className="portfolio-row-status">
              <ClockIcon size={12} className="icon-inline" /> {formatTL(d.deferredAmount)} {t({ tr: "bekliyor", en: "pending" })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
