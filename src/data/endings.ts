import type { HouseResult } from "../types";

export interface Ending {
  title: string;
  description: string;
}

const RICH_THRESHOLD = 700000;
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
