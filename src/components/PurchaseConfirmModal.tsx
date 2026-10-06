import { t } from "../data/language";
import { CloseIcon } from "./icons";
import GameIcon from "./GameIcon";

interface PurchaseConfirmModalProps {
  icon?: string;
  title: string;
  description: string;
  priceLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Shared tap-to-buy confirmation step for Market/Inventory items — a real
 * purchase should never fire from a single accidental tap on a crowded row.
 * Shows the item's full description with room to breathe, then a single
 * clear "Buy" button carrying the actual price.
 */
export default function PurchaseConfirmModal({ icon, title, description, priceLabel, onConfirm, onCancel }: PurchaseConfirmModalProps) {
  return (
    <div className="modal-overlay purchase-confirm-overlay" onClick={onCancel}>
      <div className="purchase-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="market-close" onClick={onCancel} aria-label={t({ tr: "Kapat", en: "Close" })}>
          <CloseIcon size={12} />
        </button>
        {icon && <span className="purchase-confirm-icon"><GameIcon name={icon} size={28} /></span>}
        <p className="purchase-confirm-title">{title}</p>
        <p className="purchase-confirm-description">{description}</p>
        <button className="pixel-btn purchase-confirm-buy" onClick={onConfirm}>
          {t({ tr: "Satın Al", en: "Buy" })} — {priceLabel}
        </button>
        <button className="menu-btn ghost purchase-confirm-cancel" onClick={onCancel}>
          {t({ tr: "Vazgeç", en: "Cancel" })}
        </button>
      </div>
    </div>
  );
}
