import type { Localized } from "./language";

/**
 * "Yeni Güne Geç" akışında sunulan opsiyonel aktiviteler — her biri enerji
 * harcar (ev göstermekten çok daha az, bkz ENERGY_DEPLETION_PER_HOUSE=35),
 * bu enerji ekonomiyi reklam/Jetton ile geri satın alma döngüsüne besler.
 * Her biri günde bir kez yapılabilir (App.tsx'te index'e göre sıfırlanır).
 */
export interface DayActivity {
  id: string;
  icon: string;
  label: Localized;
  description: Localized;
  energyCost: number;
}

export const dayActivities: DayActivity[] = [
  {
    id: "research",
    icon: "🔍",
    label: { tr: "Müşteri Araştırması", en: "Customer Research" },
    description: {
      tr: "Bugünkü müşteriyi önceden araştır — şüphesi biraz daha düşük başlar.",
      en: "Look into today's client beforehand — they start a bit less suspicious.",
    },
    energyCost: 5,
  },
  {
    id: "marketing",
    icon: "📣",
    label: { tr: "Pazarlama", en: "Marketing" },
    description: {
      tr: "Sosyal medyada küçük bir paylaşım yap — Muzaffer Bey'in keyfi biraz artar.",
      en: "Post something small on social media — Muzaffer Bey's mood improves a bit.",
    },
    energyCost: 8,
  },
  {
    id: "office-work",
    icon: "🗂️",
    label: { tr: "Ofis İşleri", en: "Office Work" },
    description: {
      tr: "Evrak işlerini hallet — küçük bir ek kazanç.",
      en: "Handle some paperwork — a small extra payout.",
    },
    energyCost: 10,
  },
];

export const RESEARCH_SUSPICION_DISCOUNT = 8;
export const MARKETING_BOSS_MOOD_GAIN = 3;
export const OFFICE_WORK_BONUS_EARNINGS = 5000;
