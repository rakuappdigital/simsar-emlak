import type { Localized } from "./language";

/**
 * G8-d — diyalog satırlarının harf harf yazılma hızı. "normal" oyunun her
 * zamanki hızıdır (harf başına 16 ms) — ayara hiç dokunmayan oyuncu için
 * hiçbir şey değişmez. Ekrana dokunmak her hızda satırı hemen tamamlar.
 */
export type TextSpeed = "normal" | "hizli" | "aninda";

const KEY = "simsar-emlak-text-speed";

export const textSpeedMsPerChar: Record<TextSpeed, number> = {
  normal: 16,
  hizli: 6,
  aninda: 0,
};

export const textSpeedLabels: Record<TextSpeed, Localized> = {
  normal: { tr: "Normal", en: "Normal" },
  hizli: { tr: "Hızlı", en: "Fast" },
  aninda: { tr: "Anında", en: "Instant" },
};

export function getTextSpeed(): TextSpeed {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "normal" || v === "hizli" || v === "aninda") return v;
  } catch {
    // ignore
  }
  return "normal";
}

export function setTextSpeed(speed: TextSpeed): void {
  try {
    localStorage.setItem(KEY, speed);
  } catch {
    // ignore
  }
}
