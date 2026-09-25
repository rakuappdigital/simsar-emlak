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
    title: { tr: "Cepte Not Defteri", en: "Pocket Notebook" },
    description: { tr: "Görüşme notlarını düzenli tutmanı sağlar, şüphe artışını ek %5 azaltır.", en: "Keeps your meeting notes organized, reduces suspicion increase by an extra 5%." },
    cost: 18000,
  },
  {
    id: "enerji-icecegi",
    category: "ofis",
    title: { tr: "Enerji İçeceği", en: "Energy Drink" },
    description: { tr: "Aynı hafta art arda ev göstermenin yorgunluk etkisini ek olarak %20 azaltır.", en: "Reduces the fatigue effect of showing homes back-to-back in the same week by an extra 20%." },
    cost: 45000,
  },
  {
    id: "sansli-nal",
    category: "ofis",
    title: { tr: "Şanslı Nal", en: "Lucky Horseshoe" },
    description: { tr: "Bundan sonraki her evde eğlence puanı +10 ile başlarsın.", en: "You start with +10 fun score in every subsequent home." },
    cost: 70000,
  },
  {
    id: "empati-egitimi",
    category: "ofis",
    title: { tr: "Empati Eğitimi", en: "Empathy Training" },
    description: { tr: "Şüphe artışını ek olarak %10 azaltır (İkna Kartviziti ile birlikte çalışır).", en: "Reduces suspicion increase by an extra 10% (works together with Persuasion Business Card)." },
    cost: 95000,
  },
  {
    id: "ikna-kartviziti",
    category: "ofis",
    title: { tr: "İkna Kartviziti", en: "Persuasion Business Card" },
    description: { tr: "Bundan sonraki evlerde biriken şüphe %20 daha yavaş artar.", en: "Accumulated suspicion in subsequent homes grows 20% slower." },
    cost: 110000,
  },
  {
    id: "referans-agi",
    category: "ofis",
    title: { tr: "Referans Ağı", en: "Referral Network" },
    description: { tr: "Eski müşterilerin seni tekrar araması ve ikna olması daha olası hale gelir.", en: "Past clients become more likely to call you again and get convinced." },
    cost: 130000,
  },
  {
    id: "kisisel-asistan",
    category: "ofis",
    title: { tr: "Kişisel Asistan", en: "Personal Assistant" },
    description:
      { tr: "Randevularını senin yerine ayarlar, haftalık yorgunluk etkisini ek %15 azaltır. Ayrıca her evden önce müşteriyle küçük bir ön görüşme yapar, ilgiye +5 ile başlarsın.", en: "Schedules your appointments for you, reduces weekly fatigue effect by an extra 15%. Also holds a brief pre-meeting with the client before each house, start with +5 interest." },
    cost: 240000,
    requires: "referans-agi",
  },

  // --- Kıyafet (Prestij barına katkı sağlar) ---
  {
    id: "ucuz-kravat",
    category: "kiyafet",
    title: { tr: "Ucuz Kravat", en: "Cheap Tie" },
    description: { tr: "Prestij +5. Küçük ama bir başlangıç.", en: "Prestige +5. Small but a start." },
    cost: 15000,
    prestige: 5,
  },
  {
    id: "rahat-ayakkabi",
    category: "kiyafet",
    title: { tr: "Rahat Ayakkabılar", en: "Comfortable Shoes" },
    description: { tr: "Prestij +10. Uzun gösterimlerde daha rahat, daha güvenilir görünürsün.", en: "Prestige +10. You look more comfortable, more reliable during long showings." },
    cost: 35000,
    prestige: 10,
  },
  {
    id: "sik-gomlek",
    category: "kiyafet",
    title: { tr: "Şık Gömlek", en: "Stylish Shirt" },
    description: { tr: "Prestij +20. Müşteriler seni daha ciddiye alır.", en: "Prestige +20. Clients take you more seriously." },
    cost: 55000,
    prestige: 20,
  },
  {
    id: "luks-saat",
    category: "kiyafet",
    title: { tr: "Lüks Saat", en: "Luxury Watch" },
    description: { tr: "Prestij +40. İmajın iyice oturur.", en: "Prestige +40. Your image is well established." },
    cost: 120000,
    requires: "sik-gomlek",
    prestige: 40,
  },
  {
    id: "ozel-dikim-takim",
    category: "kiyafet",
    title: { tr: "Özel Dikim Takım Elbise", en: "Tailor-made Suit" },
    description: { tr: "Prestij +60. İstanbul'un en iyi terzisinden, imajın zirvede.", en: "Prestige +60. From Istanbul's best tailor, your image is at its peak." },
    cost: 200000,
    requires: "luks-saat",
    prestige: 60,
  },

  // --- Sertifika ---
  {
    id: "temel-satis-egitimi",
    category: "sertifika",
    title: { tr: "Temel Satış Eğitimi", en: "Basic Sales Training" },
    description: { tr: "Kapanış cümlelerinin etkisini %5 güçlendirir.", en: "Increases the effect of closing sentences by 5%." },
    cost: 40000,
  },
  {
    id: "muzakere-1",
    category: "sertifika",
    title: { tr: "Müzakere Sertifikası I", en: "Negotiation Certificate I" },
    description: { tr: "Kapanış cümlelerinin etkisini %10 güçlendirir.", en: "Increases the effect of closing sentences by 10%." },
    cost: 100000,
  },
  {
    id: "muzakere-2",
    category: "sertifika",
    title: { tr: "Müzakere Sertifikası II", en: "Negotiation Certificate II" },
    description: { tr: "Kapanış cümlelerinin etkisini toplamda %20 güçlendirir.", en: "Increases the effect of closing sentences by a total of 20%." },
    cost: 220000,
    requires: "muzakere-1",
  },
  {
    id: "muzakere-3",
    category: "sertifika",
    title: { tr: "Müzakere Sertifikası III", en: "Negotiation Certificate III" },
    description: { tr: "Kapanış cümlelerinin etkisini toplamda %30 güçlendirir.", en: "Increases the effect of closing sentences by a total of 30%." },
    cost: 400000,
    requires: "muzakere-2",
  },

  // --- Araç ---
  {
    id: "bisiklet",
    category: "arac",
    title: { tr: "Bisiklet", en: "Bicycle" },
    description: { tr: "Haftalık yorgunluk etkisini %10 azaltır. Küçük bir başlangıç.", en: "Reduces weekly fatigue effect by 10%. A small start." },
    cost: 25000,
  },
  {
    id: "ikinci-el-araba",
    category: "arac",
    title: { tr: "İkinci El Araba", en: "Second Hand Car" },
    description: { tr: "Haftalık yorgunluk etkisini %30 azaltır.", en: "Reduces weekly fatigue effect by 30%." },
    cost: 85000,
    requires: "bisiklet",
  },
  {
    id: "orta-segment-araba",
    category: "arac",
    title: { tr: "Orta Segment Araç", en: "Mid-Range Vehicle" },
    description: { tr: "Haftalık yorgunluk etkisini toplamda %55 azaltır.", en: "Reduces weekly fatigue effect by a total of 55%." },
    cost: 260000,
    requires: "ikinci-el-araba",
  },
  {
    id: "luks-arac",
    category: "arac",
    title: { tr: "Lüks Araç", en: "Luxury Vehicle" },
    description: { tr: "Haftalık yorgunluk etkisini toplamda %75 azaltır.", en: "Reduces weekly fatigue effect by a total of 75%." },
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
    title: { tr: "Portföy Yükseltmesi: Orta Segment Evler", en: "Portfolio Upgrade: Mid-Range Houses" },
    description: { tr: "Daha yüksek fiyatlı, daha zorlu bir grup ev portföyünüze eklenir. Gerekli: en az 3 satış, en az 1 ofis eşyası.", en: "A higher-priced, more challenging group of houses is added to your portfolio. Required: at least 3 sales, at least 1 office item." },
    cost: 220000,
    unlocksTier: 2,
    requiresSoldCount: 3,
    requiresOfisItemCount: 1,
  },
  {
    id: "portfoy-tier3",
    category: "kilit",
    title: { tr: "Portföy Yükseltmesi: Lüks Portföy", en: "Portfolio Upgrade: Luxury Portfolio" },
    description: { tr: "Daha değerli ve daha zorlu evler portföyünüze eklenir. Gerekli: en az 8 satış, en az 3 ofis eşyası.", en: "More valuable and more challenging houses are added to your portfolio. Required: at least 8 sales, at least 3 office items." },
    cost: 550000,
    requires: "portfoy-tier2",
    unlocksTier: 3,
    requiresSoldCount: 8,
    requiresOfisItemCount: 3,
  },
  {
    id: "portfoy-tier4",
    category: "kilit",
    title: { tr: "Portföy Yükseltmesi: Elit Portföy", en: "Portfolio Upgrade: Elite Portfolio" },
    description: { tr: "Şehrin en ulaşılmaz mülklerinden bir grup portföyünüze eklenir. Gerekli: en az 15 satış, en az 5 ofis eşyası.", en: "A group of the city's most inaccessible properties is added to your portfolio. Required: at least 15 sales, at least 5 office items." },
    cost: 950000,
    requires: "portfoy-tier3",
    unlocksTier: 4,
    requiresSoldCount: 15,
    requiresOfisItemCount: 5,
  },
  {
    id: "portfoy-tier5",
    category: "kilit",
    title: { tr: "Portföy Yükseltmesi: Efsanevi Portföy", en: "Portfolio Upgrade: Legendary Portfolio" },
    description: { tr: "Şehrin efsaneleşmiş, en lüks mülkleri portföyünüze eklenir. Gerekli: en az 25 satış, en az 6 ofis eşyası.", en: "The city's legendary, most luxurious properties are added to your portfolio. Required: at least 25 sales, at least 6 office items." },
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
    title: { tr: "Şeker İkramı", en: "Candy Treat" },
    description: {
      tr: "Görüşme sırasında müşteriye ikram etme seçeneği açar — kabul ederse ilgisi artar.",
      en: "Unlocks an in-conversation option to offer the customer a treat — accepting boosts their interest.",
    },
    cost: 5000,
    consumable: true,
  },
  {
    id: "kahve-ikrami",
    category: "sarf",
    title: { tr: "Kahve İkramı", en: "Coffee Treat" },
    description: {
      tr: "Görüşme sırasında müşteriye ikram etme seçeneği açar — kabul ederse ilgisi artar.",
      en: "Unlocks an in-conversation option to offer the customer a treat — accepting boosts their interest.",
    },
    cost: 8000,
    consumable: true,
  },
  {
    id: "acil-temizlik",
    category: "sarf",
    title: { tr: "Acil Temizlik Ekibi", en: "Emergency Cleaning Team" },
    description: { tr: "Bir sonraki evde şüphe -10 ile başlarsın.", en: "You start the next house with -10 suspicion." },
    cost: 10000,
    consumable: true,
  },
  {
    id: "sosyal-medya-reklami",
    category: "sarf",
    title: { tr: "Sosyal Medya Reklamı", en: "Social Media Ad" },
    description: { tr: "Bir sonraki evde ilgi puanı +15 ile başlarsın.", en: "You start the next house with +15 interest points." },
    cost: 15000,
    consumable: true,
  },
  {
    id: "hediye-paketi",
    category: "sarf",
    title: { tr: "Özel Hediye Paketi", en: "Special Gift Package" },
    description: { tr: "Bir sonraki evde ilgi +10 ve eğlence +10 ile başlarsın.", en: "You start the next house with +10 interest and +10 fun." },
    cost: 25000,
    consumable: true,
  },

  // --- Emlah'ın Enerjisi (anında etkili, envantere girmez) ---
  {
    id: "enerji-molasi",
    category: "sarf",
    title: { tr: "Enerji Molası", en: "Energy Break" },
    description: { tr: "Hızlı bir mola, enerji barını +30 doldurur.", en: "A quick break, fills the energy bar by +30." },
    cost: 8000,
    energyFill: 30,
  },
  {
    id: "enerji-icecegi-paketi",
    category: "sarf",
    title: { tr: "Enerji İçeceği Paketi", en: "Energy Drink Pack" },
    description: { tr: "Daha güçlü bir toparlanma, enerji barını +60 doldurur.", en: "A stronger recovery, fills the energy bar by +60." },
    cost: 18000,
    energyFill: 60,
  },
  {
    id: "enerjizan-ogle-yemegi",
    category: "sarf",
    title: { tr: "Enerjizan Öğle Yemeği", en: "Energizing Lunch" },
    description: { tr: "Doyurucu bir mola, enerji barını tamamen doldurur.", en: "A fulfilling break, completely fills the energy bar." },
    cost: 30000,
    energyFill: 100,
  },
];

export function hasPerk(owned: string[], id: string): boolean {
  return owned.includes(id);
}

// seker-ikrami/kahve-ikrami deliberately excluded — no longer a passive
// pre-house bonus, see DialogueScene.tsx's "İkram Et" and App.tsx's
// consumeOneOfEach/IKRAM_ITEMS_NOT_AUTO_CONSUMED.
export const consumableEffects: Record<string, { suspicion?: number; interest?: number; fun?: number }> = {
  "acil-temizlik": { suspicion: -10 },
  "sosyal-medya-reklami": { interest: 15 },
  "hediye-paketi": { interest: 10, fun: 10 },
};
