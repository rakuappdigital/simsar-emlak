import { inventoryItems } from "../data/inventory";
import { formatTL } from "../data/economy";
import { resolveText } from "../data/language";

interface InventoryPanelProps {
  balance: number;
  jettons: number;
  shieldHousesLeft: number;
  hasRetryCandidate: boolean;
  onBuy: (itemId: string) => void;
}

export default function InventoryPanel({ balance, jettons, shieldHousesLeft, hasRetryCandidate, onBuy }: InventoryPanelProps) {
  return (
    <div className="market-panel">
      <p className="menu-empty">
        Bakiye: {formatTL(balance)} · 🪙 {jettons}
      </p>
      {shieldHousesLeft > 0 && (
        <p className="market-item-discount">🛡️ Şüphe Kalkanı aktif — {shieldHousesLeft} ev kaldı</p>
      )}
      <div className="market-category">
        {inventoryItems.map((item) => {
          const disabled =
            (item.currency === "jetton" ? jettons < item.cost : balance < item.cost) ||
            (item.id === "guaranteed-second-chance" && !hasRetryCandidate);
          return (
            <div className="market-item" key={item.id}>
              <div className="market-item-info">
                <p className="market-item-title">
                  {item.icon} {resolveText(item.name)}
                </p>
                <p className="market-item-description">{resolveText(item.description)}</p>
              </div>
              <button className="pixel-btn small" disabled={disabled} onClick={() => onBuy(item.id)}>
                {item.currency === "jetton" ? `🪙 ${item.cost}` : formatTL(item.cost)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
