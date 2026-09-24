import type { MarketNews } from "../data/marketNews";
import { resolveText, t } from "../data/language";

interface NewsBannerProps {
  news: MarketNews | null;
}

/** Newspaper-headline style ticker on the main game screen (never the phone) for Yatırım Evleri price swings. */
export default function NewsBanner({ news }: NewsBannerProps) {
  if (!news) return null;
  return (
    <div className={`news-banner news-banner-${news.direction}`}>
      <span className="news-banner-tag">
        {news.direction === "up" ? "📈" : "📉"} {t({ tr: "EMLAK GÜNDEMİ", en: "REAL ESTATE NEWS" })}
      </span>
      <span className="news-banner-text">{resolveText(news.headline)}</span>
    </div>
  );
}
