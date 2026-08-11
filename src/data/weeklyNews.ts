/**
 * Purely cosmetic "market news" line shown once per week result screen —
 * adds pacing variety between otherwise identically-formatted weeks.
 * Deterministic per weekIndex (same seeding approach as rival.ts), never
 * read by scoring, rewards, or any gameplay decision.
 */
const newsLines: string[] = [
  "📈 Kadıköy'de kira fiyatları bu hafta yine konuşuluyor.",
  "🏗️ Beyoğlu'nda yeni bir rezidans projesi duyuruldu, komşular endişeli.",
  "📰 Emlak sektöründe bu hafta faiz oranları gündemde.",
  "🐦 Bir müşteri sosyal medyada ofisten övgüyle bahsetti, Muzaffer Bey gururlu.",
  "🚧 Şehrin bir yakasında metro çalışmaları uzadı, ulaşım yine tartışma konusu.",
  "🏦 Bankalardan yeni bir konut kredisi kampanyası duyuruldu.",
  "📸 Bir emlak influencer'ı bölgedeki daireleri gezmeye başladı.",
  "🌧️ Bu hafta hava durumu ev gezilerini biraz aksattı.",
  "🏙️ Şehir merkezinde ofis dönüşümü tartışmaları sürüyor.",
  "🎉 Ofiste bu hafta biri terfi aldı, kutlama havası var.",
  "🐌 Tapu işlemleri bu hafta biraz yavaş ilerledi, herkes şikayetçi.",
  "☕ Ofis çalışanları yeni bir kahve makinesi konusunda hemfikir olamadı.",
];

/**
 * When that week's daily quest theme has a matching news line, it's picked
 * over the generic rotation — a purely cosmetic echo so the quest banner and
 * the week-end news line feel like they're talking about the same week,
 * instead of two unrelated random picks.
 */
const questThemedLines: Record<string, string[]> = {
  "discount-free": ["📈 Emlak fiyatları bu hafta hiç düşmedi, pazarlık şansı azaldı."],
  "low-suspicion": ["📰 Bu hafta şeffaf emlakçılar öne çıkıyor, güven en değerli sermaye diyorlar."],
  "streak-2": ["🔥 Sektörde bu hafta rekor satış temposundan bahsediliyor."],
  "high-fun": ["😄 Bu hafta sohbeti iyi olan emlakçılar öne çıkıyor diyorlar."],
};

export function weeklyNewsLine(weekIndex: number, dailyQuestId?: string): string {
  if (dailyQuestId && questThemedLines[dailyQuestId]) {
    return questThemedLines[dailyQuestId][0];
  }
  // Step size coprime with the list length so consecutive weeks cycle through
  // every line before repeating, instead of clustering on the same few.
  const i = (weekIndex * 5 + 3) % newsLines.length;
  return newsLines[i];
}
