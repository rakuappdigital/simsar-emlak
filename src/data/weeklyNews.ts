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

export function weeklyNewsLine(weekIndex: number): string {
  // Step size coprime with the list length so consecutive weeks cycle through
  // every line before repeating, instead of clustering on the same few.
  const i = (weekIndex * 5 + 3) % newsLines.length;
  return newsLines[i];
}
