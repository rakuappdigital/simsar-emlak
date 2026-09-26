import type { HouseScene } from "../types";
import { resolveHouseTitle, resolveHouseLocation, t } from "../data/language";
import { formatTL } from "../data/economy";
import { resolveCustomerNames } from "../data/characterPool";
import doorArt from "../assets/ui/sale-intro-door.webp";

interface SaleIntroModalProps {
  house: HouseScene;
  castAssignment: Record<string, string[]>;
  onConfirm: () => void;
  /** "Vazgeç, İşler'e dön" — ziyareti İşler'deki bekleyen işe geri koyar. */
  onBack?: () => void;
}

const tierFlavor: Record<HouseScene["tier"], { tr: string; en: string }> = {
  1: { tr: "İlk İzlenim", en: "First Impression" },
  2: { tr: "Orta Segment", en: "Mid Range" },
  3: { tr: "Prestij Portföy", en: "Prestige Listing" },
  4: { tr: "Lüks Satış", en: "Luxury Sale" },
  5: { tr: "Efsanevi Mülk", en: "Legendary Property" },
};

/**
 * Satışa girmeden önceki "kapı eşiği" ekranı — ana menü müziği hâlâ çalarken
 * fade-in ile açılır. Oyuncu "Satışa Başla"ya basınca App.tsx hem
 * DialogueScene'i açar hem de startSaleMusic() ile müzik crossfade'ini
 * tetikler (bkz sound.ts).
 */
export default function SaleIntroModal({ house, castAssignment, onConfirm, onBack }: SaleIntroModalProps) {
  const customerName = resolveCustomerNames(house, castAssignment)[0];

  return (
    <div className="sale-intro-overlay">
      <div className="sale-intro-card">
        <div className="sale-intro-art" aria-hidden="true">
          <img src={doorArt} alt="" className="sale-intro-door-img" />
        </div>
        <span className="sale-intro-tier">{t(tierFlavor[house.tier])}</span>
        <h2 className="sale-intro-title">{resolveHouseTitle(house)}</h2>
        <p className="sale-intro-location">{resolveHouseLocation(house)}</p>
        <div className="sale-intro-stats">
          <div className="sale-intro-stat">
            <span className="sale-intro-stat-label">{t({ tr: "Müşteri", en: "Customer" })}</span>
            <span className="sale-intro-stat-value">{customerName}</span>
          </div>
          <div className="sale-intro-stat">
            <span className="sale-intro-stat-label">{t({ tr: "Talep Edilen", en: "Asking Price" })}</span>
            <span className="sale-intro-stat-value">{formatTL(house.askingPrice)}</span>
          </div>
        </div>
        <p className="sale-intro-flavor">
          {t({ tr: "Kapının önündesin. Zili çalma vakti.", en: "You're at the door. Time to ring the bell." })}
        </p>
        <button className="pixel-btn sale-intro-btn" onClick={onConfirm}>
          {t({ tr: "Satışa Başla", en: "Start the Sale" })}
        </button>
        {onBack && (
          <button className="sale-intro-back" onClick={onBack}>
            {t({ tr: "← Vazgeç, İşler'e dön", en: "← Not now, back to Jobs" })}
          </button>
        )}
      </div>
    </div>
  );
}
