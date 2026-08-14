import type { HouseResult } from "../types";

export interface Ending {
  title: string;
  description: string;
}

// Total commission across the full house set realistically lands anywhere
// from ~0 (barely selling) to ~6M+ TL (selling most houses, good streak/rank
// bonuses) — re-checked against the current house count/pricing whenever it
// changes, so "sold a modest handful" stays under this and "sold most of
// them" stays over it.
// Threshold sits above "sold a modest handful" so the honest-but-poor and
// kovuldu endings stay reachable instead of every playthrough reading as rich.
const RICH_THRESHOLD = 2200000;
const HONEST_AVG = 25;
const SNEAKY_AVG = 55;

export function computeEnding(results: HouseResult[], earned: number): Ending {
  if (results.length === 0) {
    return { title: "Yarım Kalan Hikaye", description: "Emlah daha işe yeni başladı." };
  }

  const avgSuspicion = results.reduce((s, r) => s + r.finalSuspicion, 0) / results.length;
  const honest = avgSuspicion <= HONEST_AVG;
  const sneaky = avgSuspicion >= SNEAKY_AVG;
  const rich = earned >= RICH_THRESHOLD;

  if (honest && rich) {
    return {
      title: "Kendi Ofisini Açtı",
      description: "Dürüstlüğü ve başarısı bir arada — Emlah artık kendi adını taşıyan bir ofiste çalışıyor.",
    };
  }
  if (honest && !rich) {
    return {
      title: "Az Kazandı Ama Huzurlu",
      description: "Cebi pek dolmadı ama Emlah geceleri rahat uyuyor.",
    };
  }
  if (sneaky && rich) {
    return {
      title: "Muzaffer Bey'in Ortağı Oldu",
      description: "Yöntemleri tartışmalı ama rakamlar ortada — Emlah artık şirketin yarısına ortak.",
    };
  }
  if (sneaky && !rich) {
    return {
      title: "Kovuldu",
      description: "Ne yeterince sattı ne de güven kazandı. Muzaffer Bey'in son mesajı: \"Bu iş sende değilmiş.\"",
    };
  }
  return {
    title: "Sektörde Sağlam Bir İsim Oldu",
    description: "Ne çok sinsi ne fazla dürüst — Emlah dengeyi buldu, istikrarlı bir kariyer kurdu.",
  };
}
