import type { Localized } from "./language";

/**
 * "Yeni Güne Geç" akışında sunulan opsiyonel aktiviteler — her biri enerji
 * harcar (ev göstermekten çok daha az, bkz ENERGY_DEPLETION_PER_HOUSE=35),
 * bu enerji ekonomiyi reklam/Jetton ile geri satın alma döngüsüne besler.
 * Her biri günde bir kez yapılabilir (App.tsx'te index'e göre sıfırlanır).
 */
export interface DayActivity {
  id: string;
  label: Localized;
  description: Localized;
  /** Kartta gösterilen kısa etki etiketi — oyuncu neye enerji harcadığını görsün. */
  effect: Localized;
  energyCost: number;
}

export const dayActivities: DayActivity[] = [
  {
    id: "research",
    label: { tr: "Müşteri Araştırması", en: "Customer Research" },
    description: {
      tr: "Bugünkü müşteriyi önceden araştır — şüphesi biraz daha düşük başlar.",
      en: "Look into today's client beforehand — they start a bit less suspicious.",
    },
    effect: { tr: "Bugünkü müşteri −8 şüphe", en: "Today's client −8 suspicion" },
    energyCost: 5,
  },
  {
    id: "marketing",
    label: { tr: "Pazarlama", en: "Marketing" },
    description: {
      tr: "Sosyal medyada küçük bir paylaşım yap — Muzaffer Bey'in keyfi biraz artar.",
      en: "Post something small on social media — Muzaffer Bey's mood improves a bit.",
    },
    effect: { tr: "Mini oyun · Patron +1 / +3 / +5", en: "Mini-game · Boss +1 / +3 / +5" },
    energyCost: 8,
  },
  {
    id: "office-work",
    label: { tr: "Ofis İşleri", en: "Office Work" },
    description: {
      tr: "Evrak işlerini hallet — küçük bir ek kazanç.",
      en: "Handle some paperwork — a small extra payout.",
    },
    effect: { tr: "Mini oyun · +₺2.500 / 5.000 / 7.500", en: "Mini-game · +₺2,500 / 5,000 / 7,500" },
    energyCost: 10,
  },
  {
    id: "tea",
    label: { tr: "Esnafla Çay", en: "Tea with Shopkeepers" },
    description: {
      tr: "Mahalle esnafıyla çay iç, Muhtar Cemal'in defterine bak — küçük işler, yerel bilgiler.",
      en: "Have tea with the local shopkeepers and check Headman Cemal's notebook — small favors, local tips.",
    },
    effect: { tr: "Muhtar'ın Defteri", en: "Headman's Notebook" },
    energyCost: 4,
  },
];

export const RESEARCH_SUSPICION_DISCOUNT = 8;
/** Pazarlama (Vitrin Karesi) — kademe başına patron memnuniyeti: yarım / tam / mükemmel. */
export const MARKETING_BOSS_MOOD_BY_TIER = [1, 3, 5] as const;
/** Mükemmel ilan fotoğrafı bugünkü müşterinin ilgisini de artırır. */
export const MARKETING_PERFECT_INTEREST = 5;
/** Ofis İşleri (Tapu Masası) — kademe başına ek kazanç. */
export const OFFICE_WORK_EARNINGS_BY_TIER = [2500, 5000, 7500] as const;
/** Tapu Masası'nda mükemmel skorla kaçmış bir müşteriye tekrar ulaşma hakkı bulunma ihtimali. */
export const FORGOTTEN_FILE_CHANCE = 0.25;
