import type { MarketNews } from "../data/marketNews";

interface NewsBannerProps {
  news: MarketNews | null;
}

/** Newspaper-headline style ticker on the main game screen (never the phone) for Yatırım Evleri price swings. */
export default function NewsBanner({ news }: NewsBannerProps) {
  if (!news) return null;
  return (
    <div className={`news-banner news-banner-${news.direction}`}>
      <span className="news-banner-tag">{news.direction === "up" ? "📈 EMLAK GÜNDEMİ" : "📉 EMLAK GÜNDEMİ"}</span>
      <span className="news-banner-text">{news.headline}</span>
    </div>
  );
}
