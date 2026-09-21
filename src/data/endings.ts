import type { HouseResult } from "../types";
import type { Localized } from "./language";

export interface Ending {
  title: Localized;
  description: Localized;
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
    return {
      title: { tr: "Yarım Kalan Hikaye", en: "An Unfinished Story" },
      description: { tr: "Emlah daha işe yeni başladı.", en: "Emlah has just started his journey." },
    };
  }

  const avgSuspicion = results.reduce((s, r) => s + r.finalSuspicion, 0) / results.length;
  const honest = avgSuspicion <= HONEST_AVG;
  const sneaky = avgSuspicion >= SNEAKY_AVG;
  const rich = earned >= RICH_THRESHOLD;

  if (honest && rich) {
    return {
      title: { tr: "Kendi Ofisini Açtı", en: "Opened His Own Office" },
      description: {
        tr: "Dürüstlüğü ve başarısı bir arada — Emlah artık kendi adını taşıyan bir ofiste çalışıyor.",
        en: "Honesty and success combined — Emlah now works in an office bearing his own name.",
      },
    };
  }
  if (honest && !rich) {
    return {
      title: { tr: "Az Kazandı Ama Huzurlu", en: "Earned Less But Peaceful" },
      description: {
        tr: "Cebi pek dolmadı ama Emlah geceleri rahat uyuyor.",
        en: "His pockets aren't bulging, but Emlah sleeps soundly at night.",
      },
    };
  }
  if (sneaky && rich) {
    return {
      title: { tr: "Muzaffer Bey'in Ortağı Oldu", en: "Became Muzaffer Bey's Partner" },
      description: {
        tr: "Yöntemleri tartışmalı ama rakamlar ortada — Emlah artık şirketin yarısına ortak.",
        en: "His methods are debatable, but the numbers speak for themselves — Emlah is now a half-partner in the company.",
      },
    };
  }
  if (sneaky && !rich) {
    return {
      title: { tr: "Kovuldu", en: "Fired" },
      description: {
        tr: "Ne yeterince sattı ne de güven kazandı. Muzaffer Bey'in son mesajı: \"Bu iş sende değilmiş.\"",
        en: "He neither sold enough nor earned trust. Muzaffer Bey's final message: \"Looks like this job wasn't for you.\"",
      },
    };
  }
  return {
    title: { tr: "Sektörde Sağlam Bir İsim Oldu", en: "Became a Solid Name in the Industry" },
    description: {
      tr: "Ne çok sinsi ne fazla dürüst — Emlah dengeyi buldu, istikrarlı bir kariyer kurdu.",
      en: "Neither too sneaky nor overly honest — Emlah found the balance, building a steady career.",
    },
  };
}
