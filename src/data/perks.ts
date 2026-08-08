import type { Perk } from "../types";

/**
 * The full "Ofis Marketi" catalog — permanent upgrades (ofis/kiyafet/sertifika/arac),
 * one-time portfolio unlocks (kilit), and single-use consumables (sarf).
 */
export const perks: Perk[] = [
  // --- Ofis ---
  {
    id: "ikna-kartviziti",
    category: "ofis",
    title: "İkna Kartviziti",
    description: "Bundan sonraki evlerde biriken şüphe %20 daha yavaş artar.",
    cost: 150000,
  },
  {
    id: "sansli-nal",
    category: "ofis",
    title: "Şanslı Nal",
    description: "Bundan sonraki her evde eğlence puanı +10 ile başlarsın.",
    cost: 100000,
  },
  {
    id: "referans-agi",
    category: "ofis",
    title: "Referans Ağı",
    description: "Eski müşterilerin seni tekrar araması ve ikna olması daha olası hale gelir.",
    cost: 180000,
  },
  {
    id: "enerji-icecegi",
    category: "ofis",
    title: "Enerji İçeceği",
    description: "Aynı hafta art arda ev göstermenin yorgunluk etkisini ek olarak %20 azaltır.",
    cost: 90000,
  },
  {
    id: "empati-egitimi",
    category: "ofis",
    title: "Empati Eğitimi",
    description: "Şüphe artışını ek olarak %10 azaltır (İkna Kartviziti ile birlikte çalışır).",
    cost: 130000,
  },

  // --- Kıyafet ---
  {
    id: "sik-gomlek",
    category: "kiyafet",
    title: "Şık Gömlek",
    description: "Bundan sonraki her evde ilgi puanı +5 ile başlarsın.",
    cost: 60000,
  },
  {
    id: "luks-saat",
    category: "kiyafet",
    title: "Lüks Saat",
    description: "Müşteriler seni daha ciddiye alır — ilgi puanı ek +8 ile başlarsın.",
    cost: 140000,
    requires: "sik-gomlek",
  },
  {
    id: "rahat-ayakkabi",
    category: "kiyafet",
    title: "Rahat Ayakkabılar",
    description: "Uzun gösterimlerde daha keyifli olursun — eğlence puanı +5 ile başlarsın.",
    cost: 50000,
  },

  // --- Sertifika ---
  {
    id: "muzakere-1",
    category: "sertifika",
    title: "Müzakere Sertifikası I",
    description: "Kapanış cümlelerinin etkisini %10 güçlendirir.",
    cost: 120000,
  },
  {
    id: "muzakere-2",
    category: "sertifika",
    title: "Müzakere Sertifikası II",
    description: "Kapanış cümlelerinin etkisini toplamda %20 güçlendirir.",
    cost: 250000,
    requires: "muzakere-1",
  },

  // --- Araç ---
  {
    id: "ikinci-el-araba",
    category: "arac",
    title: "İkinci El Araba",
    description: "Haftalık yorgunluk etkisini %30 azaltır.",
    cost: 100000,
  },
  {
    id: "orta-segment-araba",
    category: "arac",
    title: "Orta Segment Araç",
    description: "Haftalık yorgunluk etkisini toplamda %55 azaltır.",
    cost: 300000,
    requires: "ikinci-el-araba",
  },
  {
    id: "luks-arac",
    category: "arac",
    title: "Lüks Araç",
    description: "Haftalık yorgunluk etkisini toplamda %75 azaltır, ayrıca ilgi puanı +5 ile başlarsın.",
    cost: 600000,
    requires: "orta-segment-araba",
  },

  // --- Portföy Kilidi ---
  {
    id: "portfoy-tier2",
    category: "kilit",
    title: "Portföy Yükseltmesi: Orta Segment Evler",
    description: "Daha yüksek fiyatlı, daha zorlu bir grup ev portföyünüze eklenir.",
    cost: 250000,
    unlocksTier: 2,
  },
  {
    id: "portfoy-tier3",
    category: "kilit",
    title: "Portföy Yükseltmesi: Lüks Portföy",
    description: "En değerli ve en zorlu evler portföyünüze eklenir.",
    cost: 600000,
    requires: "portfoy-tier2",
    unlocksTier: 3,
  },

  // --- Sarf Malzemesi (tek kullanımlık) ---
  {
    id: "sosyal-medya-reklami",
    category: "sarf",
    title: "Sosyal Medya Reklamı",
    description: "Bir sonraki evde ilgi puanı +15 ile başlarsın.",
    cost: 15000,
    consumable: true,
  },
  {
    id: "acil-temizlik",
    category: "sarf",
    title: "Acil Temizlik Ekibi",
    description: "Bir sonraki evde şüphe -10 ile başlarsın.",
    cost: 10000,
    consumable: true,
  },
  {
    id: "kahve-ikrami",
    category: "sarf",
    title: "Kahve İkramı",
    description: "Bir sonraki evde eğlence puanı +10 ile başlarsın.",
    cost: 8000,
    consumable: true,
  },
];

export function hasPerk(owned: string[], id: string): boolean {
  return owned.includes(id);
}

export const consumableEffects: Record<string, { suspicion?: number; interest?: number; fun?: number }> = {
  "sosyal-medya-reklami": { interest: 15 },
  "acil-temizlik": { suspicion: -10 },
  "kahve-ikrami": { fun: 10 },
};
