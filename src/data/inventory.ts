import type { Localized } from "./language";

/**
 * "Envanter" — oyun içi eşyalar. Market'teki (perks.ts) kalıcı TL eşyalarından
 * ayrı: burada tüketilebilir, bir sonraki ev(ler)e etki eden buff'lar satılıyor.
 * Üçü Jetton ile (premium para birimi), biri TL ile satılıyor.
 */
export interface InventoryItem {
  id: string;
  /** GameIcon anahtarı (bkz. components/GameIcon.tsx) — emoji değil. */
  icon: string;
  name: Localized;
  description: Localized;
  currency: "money" | "jetton";
  cost: number;
}

export const inventoryItems: InventoryItem[] = [
  {
    id: "suspicion-shield",
    icon: "shield",
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
    icon: "clover",
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
    icon: "bolt",
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
    icon: "tie",
    name: { tr: "Özgüven Kıyafeti", en: "Confidence Outfit" },
    description: {
      tr: "Sıradaki evde şüphe daha düşük başlar.",
      en: "Your next house starts with lower suspicion.",
    },
    currency: "money",
    cost: 8000,
  },
  // --- Ofis eşyaları (TL) ---
  {
    id: "desk-lamp",
    icon: "lamp",
    name: { tr: "Masa Lambası", en: "Desk Lamp" },
    description: { tr: "Sıradaki evde ilgi biraz daha yüksek başlar.", en: "Your next house starts with a bit more interest." },
    currency: "money",
    cost: 3000,
  },
  {
    id: "wall-painting",
    icon: "frame",
    name: { tr: "Duvar Tablosu", en: "Wall Painting" },
    description: { tr: "Sıradaki evde eğlence biraz daha yüksek başlar.", en: "Your next house starts with a bit more fun." },
    currency: "money",
    cost: 3000,
  },
  {
    id: "potted-plant",
    icon: "plant",
    name: { tr: "Yeşil Saksı", en: "Potted Plant" },
    description: { tr: "Sıradaki evde şüphe biraz daha düşük başlar.", en: "Your next house starts a bit less suspicious." },
    currency: "money",
    cost: 2500,
  },
  {
    id: "coffee-machine",
    icon: "cup",
    name: { tr: "Kahve Makinesi", en: "Coffee Machine" },
    description: { tr: "Enerjine anında küçük bir takviye yapar.", en: "Gives your energy a small instant boost." },
    currency: "money",
    cost: 2000,
  },
  {
    id: "comfort-chair",
    icon: "chair",
    name: { tr: "Konfor Koltuğu", en: "Comfort Chair" },
    description: { tr: "Enerjine anında orta düzey bir takviye yapar.", en: "Gives your energy a moderate instant boost." },
    currency: "money",
    cost: 4000,
  },
  {
    id: "trophy-shelf",
    icon: "trophy",
    name: { tr: "Plaket Rafı", en: "Trophy Shelf" },
    description: { tr: "Sıradaki evde ilgi daha da yüksek başlar.", en: "Your next house starts with noticeably more interest." },
    currency: "money",
    cost: 5000,
  },
  {
    id: "new-sign",
    icon: "sign",
    name: { tr: "Yeni Tabela", en: "New Sign" },
    description: { tr: "Patron memnuniyetine anında küçük bir katkı sağlar.", en: "Gives an instant small boost to your boss's mood." },
    currency: "money",
    cost: 3500,
  },
  // --- Jetonla, oyuna etki eden ürünler ---
  {
    id: "guaranteed-second-chance",
    icon: "refresh",
    name: { tr: "Garantili İkinci Şans", en: "Guaranteed Second Chance" },
    description: {
      tr: "Kaybettiğin, henüz tekrar denemediğin bir evi hemen tekrar arar. Uygun ev yoksa satın alınamaz.",
      en: "Immediately calls back a lost house you haven't retried yet. Unavailable if none are eligible.",
    },
    currency: "jetton",
    cost: 3,
  },
  {
    id: "flawless-impression",
    icon: "spark",
    name: { tr: "Kusursuz İzlenim", en: "Flawless Impression" },
    description: { tr: "Sıradaki evde eğlence garantili yüksek başlar.", en: "Your next house starts with guaranteed high fun." },
    currency: "jetton",
    cost: 2,
  },
  {
    id: "boss-note",
    icon: "envelope",
    name: { tr: "Patron Notu", en: "Boss's Note" },
    description: { tr: "Patron memnuniyetine anında belirgin bir katkı sağlar.", en: "Gives an instant, noticeable boost to your boss's mood." },
    currency: "jetton",
    cost: 2,
  },
  {
    id: "solid-reference",
    icon: "clipboard",
    name: { tr: "Sağlam Referans", en: "Solid Reference" },
    description: { tr: "Sıradaki evde şüphe belirgin şekilde düşük başlar.", en: "Your next house starts noticeably less suspicious." },
    currency: "jetton",
    cost: 3,
  },
  {
    id: "energy-reserve",
    icon: "battery",
    name: { tr: "Ekstra Enerji Deposu", en: "Extra Energy Reserve" },
    description: { tr: "Enerjine anında orta-büyük bir takviye yapar.", en: "Gives your energy a fairly large instant boost." },
    currency: "jetton",
    cost: 3,
  },
  {
    id: "lucky-appointment",
    icon: "target",
    name: { tr: "Şanslı Randevu", en: "Lucky Appointment" },
    description: { tr: "Sıradaki evde ilgi garantili yüksek başlar.", en: "Your next house starts with guaranteed high interest." },
    currency: "jetton",
    cost: 2,
  },
];

export const SUSPICION_SHIELD_HOUSES = 3;
export const SUSPICION_SHIELD_DISCOUNT = 12;
export const LUCKY_CALL_INTEREST_BONUS = 15;
export const LUCKY_CALL_SUSPICION_DISCOUNT = 10;
export const CONFIDENCE_OUTFIT_DISCOUNT = 10;
export const DESK_LAMP_INTEREST_BONUS = 5;
export const WALL_PAINTING_FUN_BONUS = 5;
export const POTTED_PLANT_SUSPICION_DISCOUNT = 5;
export const COFFEE_MACHINE_ENERGY = 5;
export const COMFORT_CHAIR_ENERGY = 10;
export const TROPHY_SHELF_INTEREST_BONUS = 8;
export const NEW_SIGN_BOSS_MOOD_GAIN = 4;
export const FLAWLESS_IMPRESSION_FUN_BONUS = 25;
export const BOSS_NOTE_MOOD_GAIN = 8;
export const SOLID_REFERENCE_SUSPICION_DISCOUNT = 20;
export const ENERGY_RESERVE_AMOUNT = 30;
export const LUCKY_APPOINTMENT_INTEREST_BONUS = 25;

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
