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
/**
 * Small, capped reward for the "Dürüstlük Serisi" badge (3 low-suspicion
 * sales in a row) — a fixed, one-time-effect discount on a single ofis
 * item, not a stacking or open-ended bonus, so it can't skew the market's
 * cost balance no matter how the rest of a run goes.
 */
export const BADGE_DISCOUNT_PERK_ID = "ikna-kartviziti";
export const BADGE_DISCOUNT_BADGE_ID = "durust-seri";
export const BADGE_DISCOUNT_RATE = 0.1;

/**
 * Same idea as the badge discount, but tied to the calendar instead of an
 * achievement — every 3rd week (a deterministic, easily-testable schedule,
 * same seeding spirit as weeklyNews.ts) a single ofis item goes on sale.
 * Different item than the badge discount, so the two never stack on the
 * same purchase, keeping the market's cost balance easy to reason about.
 */
export const CAMPAIGN_PERK_ID = "enerji-icecegi";
export const CAMPAIGN_DISCOUNT_RATE = 0.15;

export function isCampaignWeek(weekIndex: number): boolean {
  return weekIndex % 3 === 1;
}

/** Actual price to charge/display for an item, after any badge- or campaign-earned discount. */
export function effectiveCost(item: Perk, ownedBadges: string[], weekIndex: number): number {
  if (item.id === BADGE_DISCOUNT_PERK_ID && ownedBadges.includes(BADGE_DISCOUNT_BADGE_ID)) {
    return Math.round(item.cost * (1 - BADGE_DISCOUNT_RATE));
  }
  if (item.id === CAMPAIGN_PERK_ID && isCampaignWeek(weekIndex)) {
    return Math.round(item.cost * (1 - CAMPAIGN_DISCOUNT_RATE));
  }
  return item.cost;
}

export const perks: Perk[] = [
  // --- Ofis ---
  {
    id: "not-defteri",
    category: "ofis",
    title: "Cepte Not Defteri",
    description: "Görüşme notlarını düzenli tutmanı sağlar, şüphe artışını ek %5 azaltır.",
    cost: 18000,
  },
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
  {
    id: "kisisel-asistan",
    category: "ofis",
    title: "Kişisel Asistan",
    description:
      "Randevularını senin yerine ayarlar, haftalık yorgunluk etkisini ek %15 azaltır. Ayrıca her evden önce müşteriyle küçük bir ön görüşme yapar, ilgiye +5 ile başlarsın.",
    cost: 240000,
    requires: "referans-agi",
  },

  // --- Kıyafet (Prestij barına katkı sağlar) ---
  {
    id: "ucuz-kravat",
    category: "kiyafet",
    title: "Ucuz Kravat",
    description: "Prestij +5. Küçük ama bir başlangıç.",
    cost: 15000,
    prestige: 5,
  },
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
  {
    id: "ozel-dikim-takim",
    category: "kiyafet",
    title: "Özel Dikim Takım Elbise",
    description: "Prestij +60. İstanbul'un en iyi terzisinden, imajın zirvede.",
    cost: 200000,
    requires: "luks-saat",
    prestige: 60,
  },

  // --- Sertifika ---
  {
    id: "temel-satis-egitimi",
    category: "sertifika",
    title: "Temel Satış Eğitimi",
    description: "Kapanış cümlelerinin etkisini %5 güçlendirir.",
    cost: 40000,
  },
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
  {
    id: "muzakere-3",
    category: "sertifika",
    title: "Müzakere Sertifikası III",
    description: "Kapanış cümlelerinin etkisini toplamda %30 güçlendirir.",
    cost: 400000,
    requires: "muzakere-2",
  },

  // --- Araç ---
  {
    id: "bisiklet",
    category: "arac",
    title: "Bisiklet",
    description: "Haftalık yorgunluk etkisini %10 azaltır. Küçük bir başlangıç.",
    cost: 25000,
  },
  {
    id: "ikinci-el-araba",
    category: "arac",
    title: "İkinci El Araba",
    description: "Haftalık yorgunluk etkisini %30 azaltır.",
    cost: 85000,
    requires: "bisiklet",
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
  // Each tier needs the fee below AND a minimum sold-house count AND a
  // minimum number of owned "Ofis Ekipmanı" items — pure money can't rush
  // through tiers, selling houses is what actually unlocks them.
  {
    id: "portfoy-tier2",
    category: "kilit",
    title: "Portföy Yükseltmesi: Orta Segment Evler",
    description: "Daha yüksek fiyatlı, daha zorlu bir grup ev portföyünüze eklenir. Gerekli: en az 3 satış, en az 1 ofis eşyası.",
    cost: 220000,
    unlocksTier: 2,
    requiresSoldCount: 3,
    requiresOfisItemCount: 1,
  },
  {
    id: "portfoy-tier3",
    category: "kilit",
    title: "Portföy Yükseltmesi: Lüks Portföy",
    description: "Daha değerli ve daha zorlu evler portföyünüze eklenir. Gerekli: en az 8 satış, en az 3 ofis eşyası.",
    cost: 550000,
    requires: "portfoy-tier2",
    unlocksTier: 3,
    requiresSoldCount: 8,
    requiresOfisItemCount: 3,
  },
  {
    id: "portfoy-tier4",
    category: "kilit",
    title: "Portföy Yükseltmesi: Elit Portföy",
    description: "Şehrin en ulaşılmaz mülklerinden bir grup portföyünüze eklenir. Gerekli: en az 15 satış, en az 5 ofis eşyası.",
    cost: 950000,
    requires: "portfoy-tier3",
    unlocksTier: 4,
    requiresSoldCount: 15,
    requiresOfisItemCount: 5,
  },
  {
    id: "portfoy-tier5",
    category: "kilit",
    title: "Portföy Yükseltmesi: Efsanevi Portföy",
    description: "Şehrin efsaneleşmiş, en lüks mülkleri portföyünüze eklenir. Gerekli: en az 25 satış, en az 6 ofis eşyası.",
    cost: 1600000,
    requires: "portfoy-tier4",
    unlocksTier: 5,
    requiresSoldCount: 25,
    requiresOfisItemCount: 6,
  },

  // --- Sarf Malzemesi (tek kullanımlık) ---
  {
    id: "seker-ikrami",
    category: "sarf",
    title: "Şeker İkramı",
    description: "Bir sonraki evde eğlence puanı +5 ile başlarsın.",
    cost: 5000,
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
  {
    id: "acil-temizlik",
    category: "sarf",
    title: "Acil Temizlik Ekibi",
    description: "Bir sonraki evde şüphe -10 ile başlarsın.",
    cost: 10000,
    consumable: true,
  },
  {
    id: "sosyal-medya-reklami",
    category: "sarf",
    title: "Sosyal Medya Reklamı",
    description: "Bir sonraki evde ilgi puanı +15 ile başlarsın.",
    cost: 15000,
    consumable: true,
  },
  {
    id: "hediye-paketi",
    category: "sarf",
    title: "Özel Hediye Paketi",
    description: "Bir sonraki evde ilgi +10 ve eğlence +10 ile başlarsın.",
    cost: 25000,
    consumable: true,
  },
];

export function hasPerk(owned: string[], id: string): boolean {
  return owned.includes(id);
}

export const consumableEffects: Record<string, { suspicion?: number; interest?: number; fun?: number }> = {
  "seker-ikrami": { fun: 5 },
  "kahve-ikrami": { fun: 10 },
  "acil-temizlik": { suspicion: -10 },
  "sosyal-medya-reklami": { interest: 15 },
  "hediye-paketi": { interest: 10, fun: 10 },
};
