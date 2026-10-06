import { useState } from "react";
import { inventoryItems } from "../data/inventory";
import { formatTL } from "../data/economy";
import { resolveText, t } from "../data/language";
import PurchaseConfirmModal from "./PurchaseConfirmModal";
import GameIcon from "./GameIcon";
import { CoinIcon, ShieldIcon } from "./icons";

interface InventoryPanelProps {
  balance: number;
  jettons: number;
  shieldHousesLeft: number;
  hasRetryCandidate: boolean;
  onBuy: (itemId: string) => void;
}

export default function InventoryPanel({ balance, jettons, shieldHousesLeft, hasRetryCandidate, onBuy }: InventoryPanelProps) {
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const pendingItem = pendingItemId ? inventoryItems.find((i) => i.id === pendingItemId) : undefined;

  return (
    <div className="market-panel">
      <p className="menu-empty">
        {t({ tr: "Bakiye", en: "Balance" })}: {formatTL(balance)} · <CoinIcon size={12} className="icon-inline" /> {jettons}
      </p>
      {shieldHousesLeft > 0 && (
        <p className="market-item-discount">
          <ShieldIcon size={12} className="icon-inline" /> {t({ tr: "Şüphe Kalkanı aktif", en: "Suspicion Shield active" })} — {shieldHousesLeft}{" "}
          {t({ tr: "ev kaldı", en: "houses left" })}
        </p>
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
                  <GameIcon name={item.icon} size={14} className="icon-inline market-item-icon" /> {resolveText(item.name)}
                </p>
              </div>
              <button className="pixel-btn small" disabled={disabled} onClick={() => setPendingItemId(item.id)}>
                {item.currency === "jetton" ? (
                  <>
                    <CoinIcon size={12} className="icon-inline" /> {item.cost}
                  </>
                ) : (
                  formatTL(item.cost)
                )}
              </button>
            </div>
          );
        })}
      </div>
      {pendingItem && (
        <PurchaseConfirmModal
          icon={pendingItem.icon}
          title={resolveText(pendingItem.name)}
          description={resolveText(pendingItem.description)}
          priceLabel={pendingItem.currency === "jetton" ? `${pendingItem.cost} Jetton` : formatTL(pendingItem.cost)}
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
