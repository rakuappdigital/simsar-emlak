import type { Localized } from "./language";

/**
 * "Envanter" — oyun içi eşyalar. Market'teki (perks.ts) kalıcı TL eşyalarından
 * ayrı: burada tüketilebilir, bir sonraki ev(ler)e etki eden buff'lar satılıyor.
 * Üçü Jetton ile (premium para birimi), biri TL ile satılıyor.
 */
export interface InventoryItem {
  id: string;
  icon: string;
  name: Localized;
  description: Localized;
  currency: "money" | "jetton";
  cost: number;
}

export const inventoryItems: InventoryItem[] = [
  {
    id: "suspicion-shield",
    icon: "🛡️",
    name: { tr: "Şüphe Kalkanı", en: "Suspicion Shield" },
    description: {
      tr: "Sıradaki 3 evde şüphe daha düşük başlar.",
      en: "Your next 3 houses start with lower suspicion.",
    },
    currency: "jetton",
    cost: 3,
  },
  {
    id: "lucky-call",
    icon: "🍀",
    name: { tr: "Şanslı Çağrı", en: "Lucky Call" },
    description: {
      tr: "Sıradaki müşteri görüşmesi garanti yüksek ilgiyle başlar.",
      en: "Your next customer visit starts with guaranteed high interest.",
    },
    currency: "jetton",
    cost: 2,
  },
  {
    id: "energy-box",
    icon: "⚡",
    name: { tr: "Enerji Kutusu", en: "Energy Box" },
    description: {
      tr: "Enerjini anında %100'e tamamlar.",
      en: "Instantly refills your energy to 100%.",
    },
    currency: "jetton",
    cost: 4,
  },
  {
    id: "confidence-outfit",
    icon: "👔",
    name: { tr: "Özgüven Kıyafeti", en: "Confidence Outfit" },
    description: {
      tr: "Sıradaki evde şüphe daha düşük başlar.",
      en: "Your next house starts with lower suspicion.",
    },
    currency: "money",
    cost: 8000,
  },
];

export const SUSPICION_SHIELD_HOUSES = 3;
export const SUSPICION_SHIELD_DISCOUNT = 12;
export const LUCKY_CALL_INTEREST_BONUS = 15;
export const LUCKY_CALL_SUSPICION_DISCOUNT = 10;
export const CONFIDENCE_OUTFIT_DISCOUNT = 10;

/**
 * "Şüphe Kalkanı"nın kalan ev sayısı — kayıt slotlarından bağımsız kendi
 * localStorage anahtarında yaşar (jetton/adSchedule ile aynı desen), birkaç
 * evi kapsayan geçici bir buff olduğu için tam save-game entegrasyonuna
 * gerek yok.
 */
const SHIELD_KEY = "simsar-emlak-suspicion-shield-houses";

export function getShieldHousesLeft(): number {
  try {
    const n = parseInt(localStorage.getItem(SHIELD_KEY) ?? "0", 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function setShieldHousesLeft(n: number): void {
  try {
    localStorage.setItem(SHIELD_KEY, String(Math.max(0, n)));
  } catch {
    // ignore
  }
}
