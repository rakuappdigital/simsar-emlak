/**
 * "Haberler" — fake real-estate market headlines that swing prices for the
 * Yatırım Evleri pool only (never the main 54-house pool's askingPrice, to
 * keep the core commission/scoring math untouched). Shown as a banner on
 * the main game screen, not in the phone/inbox.
 */
export interface MarketNews {
  id: string;
  headline: string;
  direction: "up" | "down";
  magnitude: number;
}

export const marketNews: MarketNews[] = [
  // Fiyat yükselten haberler
  { id: "haber-kentsel-donusum", headline: "Kentsel dönüşüm bölgeye taşındı: müteahhitler bölgeyi işaretledi, fiyatlar tırmanışa geçti.", direction: "up", magnitude: 0.12 },
  { id: "haber-metro-ihale", headline: "Yeni metro hattı ihalesi onaylandı, bölge emlak talebi bir günde patladı.", direction: "up", magnitude: 0.15 },
  { id: "haber-yabanci-yatirimci", headline: "Yabancı yatırımcı ilgisi arttı, döviz bazlı taleplerle fiyatlar yükseldi.", direction: "up", magnitude: 0.1 },
  { id: "haber-dizi-cekimi", headline: "Ünlü bir dizi bölgede çekildi, mekân merakı satış fiyatlarını yukarı çekti.", direction: "up", magnitude: 0.1 },
  { id: "haber-faiz-indirimi", headline: "Faiz indirimi konut kredilerini cazipleştirdi, talep patlaması yaşandı.", direction: "up", magnitude: 0.15 },
  { id: "haber-universite-kampus", headline: "Bölgeye yeni bir üniversite kampüsü açıldı, öğrenci ve yatırımcı talebi arttı.", direction: "up", magnitude: 0.12 },
  { id: "haber-sahil-duzenleme", headline: "Sahil şeridi düzenleme projesi onaylandı, deniz manzaralı evlere talep fırladı.", direction: "up", magnitude: 0.13 },
  { id: "haber-yesil-alan", headline: "Yeşil alan projesi bölgeyi cazip hale getirdi, fiyatlar hızla yükseldi.", direction: "up", magnitude: 0.1 },
  { id: "haber-toplu-alim", headline: "Ünlü bir işadamı bölgeden toplu ev alımına başladı, fiyatlar tetiklendi.", direction: "up", magnitude: 0.14 },
  { id: "haber-turizm-rekor", headline: "Turizm sezonu rekor kırdı, kısa dönem kiralama talebi ev fiyatlarını yukarı itti.", direction: "up", magnitude: 0.11 },

  // Fiyat düşüren haberler
  { id: "haber-doviz-degisimi", headline: "Döviz kurundaki ani değişim ev fiyatlarını etkiledi, alım fırsatı doğdu.", direction: "down", magnitude: 0.12 },
  { id: "haber-deprem-raporu", headline: "Bölgede deprem riski raporu yayınlandı, satıcılar fiyat kırmaya başladı.", direction: "down", magnitude: 0.15 },
  { id: "haber-faiz-yukselisi", headline: "Faiz oranları yükseldi, konut kredisi talebi düştü, fiyatlar geriledi.", direction: "down", magnitude: 0.13 },
  { id: "haber-imar-belirsizligi", headline: "Bölgede yeni imar planı belirsizliği satıcıları tedirgin etti, fiyatlar düştü.", direction: "down", magnitude: 0.1 },
  { id: "haber-ekonomik-durgunluk", headline: "Ekonomideki durgunluk emlak piyasasına yansıdı, alıcılar bekleme moduna geçti.", direction: "down", magnitude: 0.12 },
  { id: "haber-trafik-altyapi", headline: "Bölgede trafik ve altyapı sorunları büyüdü, talep azaldı.", direction: "down", magnitude: 0.1 },
  { id: "haber-arz-fazlasi", headline: "Komşu bölgede toplu konut projesi arz fazlası yarattı, fiyatlar geriledi.", direction: "down", magnitude: 0.11 },
  { id: "haber-hava-kirliligi", headline: "Bir haber bölgedeki hava kirliliğine dikkat çekti, satışlar yavaşladı.", direction: "down", magnitude: 0.1 },
  { id: "haber-kira-denetimi", headline: "Kira denetimi tartışmaları piyasayı tedirgin etti, satıcılar fiyat indirdi.", direction: "down", magnitude: 0.12 },
  { id: "haber-sel-riski", headline: "Bölgede sel riski raporu gündeme geldi, alıcılar temkinli davranmaya başladı.", direction: "down", magnitude: 0.14 },
];

/** Avoids repeating the same headline twice in a row. */
export function pickMarketNews(excludeId?: string): MarketNews {
  const pool = excludeId ? marketNews.filter((n) => n.id !== excludeId) : marketNews;
  return pool[Math.floor(Math.random() * pool.length)];
}
