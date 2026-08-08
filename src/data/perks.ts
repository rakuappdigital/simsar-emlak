import type { Perk } from "../types";

/**
 * The full "Ofis Marketi" catalog. Prices are calibrated against a rough
 * "one average sale" baseline (~120.000 TL commission) so cost feels
 * proportionate: sarf malzemesi < 1 satış, ofis/sertifika/araç ~1 satış
 * civarı, en üst seviyeler birkaç satışlık bir yatırım.
 *
 * "Kıyafet" items don't each get a bespoke stat effect — they contribute
 * points to a shared Prestij bar (see scoring.ts: computePrestige /
 * prestigeBonus), which is what actually grants the small starting-stat
 * bonus. Simpler to read, and buying a second or third piece of clothing
 * doesn't need its own hand-tuned number.
 */
export const perks: Perk[] = [
  // --- Ofis ---
  {
    id: "enerji-icecegi",
    category: "ofis",
    title: "Enerji İçeceği",
    description: "Aynı hafta art arda ev göstermenin yorgunluk etkisini ek olarak %20 azaltır.",
    cost: 45000,
  },
  {
    id: "sansli-nal",
    category: "ofis",
    title: "Şanslı Nal",
    description: "Bundan sonraki her evde eğlence puanı +10 ile başlarsın.",
    cost: 70000,
  },
  {
    id: "empati-egitimi",
    category: "ofis",
    title: "Empati Eğitimi",
    description: "Şüphe artışını ek olarak %10 azaltır (İkna Kartviziti ile birlikte çalışır).",
    cost: 95000,
  },
  {
    id: "ikna-kartviziti",
    category: "ofis",
    title: "İkna Kartviziti",
    description: "Bundan sonraki evlerde biriken şüphe %20 daha yavaş artar.",
    cost: 110000,
  },
  {
    id: "referans-agi",
    category: "ofis",
    title: "Referans Ağı",
    description: "Eski müşterilerin seni tekrar araması ve ikna olması daha olası hale gelir.",
    cost: 130000,
  },

  // --- Kıyafet (Prestij barına katkı sağlar) ---
  {
    id: "rahat-ayakkabi",
    category: "kiyafet",
    title: "Rahat Ayakkabılar",
    description: "Prestij +10. Uzun gösterimlerde daha rahat, daha güvenilir görünürsün.",
    cost: 35000,
    prestige: 10,
  },
  {
    id: "sik-gomlek",
    category: "kiyafet",
    title: "Şık Gömlek",
    description: "Prestij +20. Müşteriler seni daha ciddiye alır.",
    cost: 55000,
    prestige: 20,
  },
  {
    id: "luks-saat",
    category: "kiyafet",
    title: "Lüks Saat",
    description: "Prestij +40. İmajın iyice oturur.",
    cost: 120000,
    requires: "sik-gomlek",
    prestige: 40,
  },

  // --- Sertifika ---
  {
    id: "muzakere-1",
    category: "sertifika",
    title: "Müzakere Sertifikası I",
    description: "Kapanış cümlelerinin etkisini %10 güçlendirir.",
    cost: 100000,
  },
  {
    id: "muzakere-2",
    category: "sertifika",
    title: "Müzakere Sertifikası II",
    description: "Kapanış cümlelerinin etkisini toplamda %20 güçlendirir.",
    cost: 220000,
    requires: "muzakere-1",
  },

  // --- Araç ---
  {
    id: "ikinci-el-araba",
    category: "arac",
    title: "İkinci El Araba",
    description: "Haftalık yorgunluk etkisini %30 azaltır.",
    cost: 85000,
  },
  {
    id: "orta-segment-araba",
    category: "arac",
    title: "Orta Segment Araç",
    description: "Haftalık yorgunluk etkisini toplamda %55 azaltır.",
    cost: 260000,
    requires: "ikinci-el-araba",
  },
  {
    id: "luks-arac",
    category: "arac",
    title: "Lüks Araç",
    description: "Haftalık yorgunluk etkisini toplamda %75 azaltır.",
    cost: 520000,
    requires: "orta-segment-araba",
  },

  // --- Portföy Kilidi ---
  {
    id: "portfoy-tier2",
    category: "kilit",
    title: "Portföy Yükseltmesi: Orta Segment Evler",
    description: "Daha yüksek fiyatlı, daha zorlu bir grup ev portföyünüze eklenir.",
    cost: 220000,
    unlocksTier: 2,
  },
  {
    id: "portfoy-tier3",
    category: "kilit",
    title: "Portföy Yükseltmesi: Lüks Portföy",
    description: "En değerli ve en zorlu evler portföyünüze eklenir.",
    cost: 550000,
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
