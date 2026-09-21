import type { Localized } from "./language";
/**
 * "Haberler" — fake real-estate market headlines that swing prices for the
 * Yatırım Evleri pool only (never the main 54-house pool's askingPrice, to
 * keep the core commission/scoring math untouched). Shown as a banner on
 * the main game screen, not in the phone/inbox.
 */
export interface MarketNews {
  id: string;
  headline: Localized;
  direction: "up" | "down";
  magnitude: number;
}

export const marketNews: MarketNews[] = [
  // Fiyat yükselten haberler
  { id: "haber-kentsel-donusum", headline: { tr: "Kentsel dönüşüm bölgeye taşındı: müteahhitler bölgeyi işaretledi, fiyatlar tırmanışa geçti.", en: "Urban transformation moved to the region: contractors marked the area, prices started climbing." }, direction: "up", magnitude: 0.12 },
  { id: "haber-metro-ihale", headline: { tr: "Yeni metro hattı ihalesi onaylandı, bölge emlak talebi bir günde patladı.", en: "New metro line tender approved, regional real estate demand exploded in a single day." }, direction: "up", magnitude: 0.15 },
  { id: "haber-yabanci-yatirimci", headline: { tr: "Yabancı yatırımcı ilgisi arttı, döviz bazlı taleplerle fiyatlar yükseldi.", en: "Foreign investor interest increased, prices rose with currency-based demands." }, direction: "up", magnitude: 0.1 },
  { id: "haber-dizi-cekimi", headline: { tr: "Ünlü bir dizi bölgede çekildi, mekân merakı satış fiyatlarını yukarı çekti.", en: "A famous TV series was filmed in the region, curiosity for the location pulled sales prices up." }, direction: "up", magnitude: 0.1 },
  { id: "haber-faiz-indirimi", headline: { tr: "Faiz indirimi konut kredilerini cazipleştirdi, talep patlaması yaşandı.", en: "Interest rate cut made housing loans attractive, a demand explosion occurred." }, direction: "up", magnitude: 0.15 },
  { id: "haber-universite-kampus", headline: { tr: "Bölgeye yeni bir üniversite kampüsü açıldı, öğrenci ve yatırımcı talebi arttı.", en: "A new university campus opened in the region, student and investor demand increased." }, direction: "up", magnitude: 0.12 },
  { id: "haber-sahil-duzenleme", headline: { tr: "Sahil şeridi düzenleme projesi onaylandı, deniz manzaralı evlere talep fırladı.", en: "Coastline arrangement project approved, demand for sea-view homes skyrocketed." }, direction: "up", magnitude: 0.13 },
  { id: "haber-yesil-alan", headline: { tr: "Yeşil alan projesi bölgeyi cazip hale getirdi, fiyatlar hızla yükseldi.", en: "Green space project made the region attractive, prices rose rapidly." }, direction: "up", magnitude: 0.1 },
  { id: "haber-toplu-alim", headline: { tr: "Ünlü bir işadamı bölgeden toplu ev alımına başladı, fiyatlar tetiklendi.", en: "A famous businessman started buying bulk houses from the region, triggering prices." }, direction: "up", magnitude: 0.14 },
  { id: "haber-turizm-rekor", headline: { tr: "Turizm sezonu rekor kırdı, kısa dönem kiralama talebi ev fiyatlarını yukarı itti.", en: "Tourism season broke records, short-term rental demand pushed home prices up." }, direction: "up", magnitude: 0.11 },

  // Fiyat düşüren haberler
  { id: "haber-doviz-degisimi", headline: { tr: "Döviz kurundaki ani değişim ev fiyatlarını etkiledi, alım fırsatı doğdu.", en: "Sudden change in exchange rate affected home prices, creating a buying opportunity." }, direction: "down", magnitude: 0.12 },
  { id: "haber-deprem-raporu", headline: { tr: "Bölgede deprem riski raporu yayınlandı, satıcılar fiyat kırmaya başladı.", en: "Earthquake risk report published in the region, sellers started slashing prices." }, direction: "down", magnitude: 0.15 },
  { id: "haber-faiz-yukselisi", headline: { tr: "Faiz oranları yükseldi, konut kredisi talebi düştü, fiyatlar geriledi.", en: "Interest rates rose, housing loan demand dropped, prices retreated." }, direction: "down", magnitude: 0.13 },
  { id: "haber-imar-belirsizligi", headline: { tr: "Bölgede yeni imar planı belirsizliği satıcıları tedirgin etti, fiyatlar düştü.", en: "New zoning plan uncertainty in the region unsettled sellers, prices dropped." }, direction: "down", magnitude: 0.1 },
  { id: "haber-ekonomik-durgunluk", headline: { tr: "Ekonomideki durgunluk emlak piyasasına yansıdı, alıcılar bekleme moduna geçti.", en: "Economic stagnation reflected on the real estate market, buyers switched to standby mode." }, direction: "down", magnitude: 0.12 },
  { id: "haber-trafik-altyapi", headline: { tr: "Bölgede trafik ve altyapı sorunları büyüdü, talep azaldı.", en: "Traffic and infrastructure problems grew in the region, demand decreased." }, direction: "down", magnitude: 0.1 },
  { id: "haber-arz-fazlasi", headline: { tr: "Komşu bölgede toplu konut projesi arz fazlası yarattı, fiyatlar geriledi.", en: "Mass housing project in the neighboring region created excess supply, prices retreated." }, direction: "down", magnitude: 0.11 },
  { id: "haber-hava-kirliligi", headline: { tr: "Bir haber bölgedeki hava kirliliğine dikkat çekti, satışlar yavaşladı.", en: "A news report drew attention to air pollution in the region, sales slowed down." }, direction: "down", magnitude: 0.1 },
  { id: "haber-kira-denetimi", headline: { tr: "Kira denetimi tartışmaları piyasayı tedirgin etti, satıcılar fiyat indirdi.", en: "Rent control discussions made the market nervous, sellers lowered prices." }, direction: "down", magnitude: 0.12 },
  { id: "haber-sel-riski", headline: { tr: "Bölgede sel riski raporu gündeme geldi, alıcılar temkinli davranmaya başladı.", en: "Flood risk report came to the agenda in the region, buyers started to act cautiously." }, direction: "down", magnitude: 0.14 },
];

/** Avoids repeating the same headline twice in a row. */
export function pickMarketNews(excludeId?: string): MarketNews {
  const pool = excludeId ? marketNews.filter((n) => n.id !== excludeId) : marketNews;
  return pool[Math.floor(Math.random() * pool.length)];
}
