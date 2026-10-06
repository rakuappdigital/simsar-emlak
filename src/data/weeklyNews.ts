import { resolveText, type Localized } from "./language";
/**
 * Purely cosmetic "market news" line shown once per week result screen —
 * adds pacing variety between otherwise identically-formatted weeks.
 * Deterministic per weekIndex (same seeding approach as rival.ts), never
 * read by scoring, rewards, or any gameplay decision.
 */
const newsLines: Localized[] = [
  { tr: "Kadıköy'de kira fiyatları bu hafta yine konuşuluyor.", en: "Rental prices in Kadıköy are being talked about again this week." },
  { tr: "Beyoğlu'nda yeni bir rezidans projesi duyuruldu, komşular endişeli.", en: "A new residence project announced in Beyoğlu, neighbors are worried." },
  { tr: "Emlak sektöründe bu hafta faiz oranları gündemde.", en: "Interest rates are on the agenda in the real estate sector this week." },
  { tr: "Bir müşteri sosyal medyada ofisten övgüyle bahsetti, Muzaffer Bey gururlu.", en: "A client praised the office on social media, Muzaffer Bey is proud." },
  { tr: "Şehrin bir yakasında metro çalışmaları uzadı, ulaşım yine tartışma konusu.", en: "Subway construction prolonged on one side of the city, transportation is a debate topic again." },
  { tr: "Bankalardan yeni bir konut kredisi kampanyası duyuruldu.", en: "A new housing loan campaign announced by banks." },
  { tr: "Bir emlak influencer'ı bölgedeki daireleri gezmeye başladı.", en: "A real estate influencer started touring apartments in the region." },
  { tr: "Bu hafta hava durumu ev gezilerini biraz aksattı.", en: "Weather conditions disrupted house tours a bit this week." },
  { tr: "Şehir merkezinde ofis dönüşümü tartışmaları sürüyor.", en: "Office conversion debates continue in the city center." },
  { tr: "Ofiste bu hafta biri terfi aldı, kutlama havası var.", en: "Someone got promoted in the office this week, celebration mood is on." },
  { tr: "Tapu işlemleri bu hafta biraz yavaş ilerledi, herkes şikayetçi.", en: "Title deed procedures progressed a bit slow this week, everyone is complaining." },
  { tr: "Ofis çalışanları yeni bir kahve makinesi konusunda hemfikir olamadı.", en: "Office workers couldn't agree on a new coffee machine." },
];

/**
 * When that week's daily quest theme has a matching news line, it's picked
 * over the generic rotation — a purely cosmetic echo so the quest banner and
 * the week-end news line feel like they're talking about the same week,
 * instead of two unrelated random picks.
 */
const questThemedLines: Record<string, Localized[]> = {
  "discount-free": [{ tr: "Emlak fiyatları bu hafta hiç düşmedi, pazarlık şansı azaldı.", en: "Real estate prices didn't drop at all this week, bargain chances decreased." }],
  "low-suspicion": [{ tr: "Bu hafta şeffaf emlakçılar öne çıkıyor, güven en değerli sermaye diyorlar.", en: "Transparent real estate agents stand out this week, trust is the most valuable capital." }],
  "streak-2": [{ tr: "Sektörde bu hafta rekor satış temposundan bahsediliyor.", en: "A record sales pace is being talked about in the industry this week." }],
  "high-fun": [{ tr: "Bu hafta sohbeti iyi olan emlakçılar öne çıkıyor diyorlar.", en: "They say realtors who have good chat stand out this week." }],
};

export function weeklyNewsLine(weekIndex: number, dailyQuestId?: string): string {
  if (dailyQuestId && questThemedLines[dailyQuestId]) {
    return resolveText(questThemedLines[dailyQuestId][0]);
  }
  // Step size coprime with the list length so consecutive weeks cycle through
  // every line before repeating, instead of clustering on the same few.
  const i = (weekIndex * 5 + 3) % newsLines.length;
  return resolveText(newsLines[i]);
}
