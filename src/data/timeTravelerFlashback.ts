import type { MemoryKind, SignificantMemory } from "../types";
import { resolveText, type Localized } from "./language";

/**
 * "Zaman Yolcusu Emlah" — a rare, one-time easter egg. Emlah briefly
 * imagines how one of his own already-recorded significantMemories (see
 * significantMemory.ts) could have gone differently. Nothing about the
 * past actually changes — no stat, no result is touched — it's a pure
 * narrative aside, shown once per playthrough at most, gated behind
 * already-existing data (no new authoring needed to pick WHICH memory).
 */
export const FLASHBACK_CHANCE = 0.04;
export const FLASHBACK_MIN_INDEX = 15;

const flashbackText: Record<MemoryKind, { title: Localized; paragraphs: Localized[] }> = {
  "kurnaz-satis": {
    title: { tr: "Bir An İçin Başka Bir Emlah", en: "For a Moment, Another Estetan" },
    paragraphs: [
      { tr: "Gözlerini kapattı, o günü hatırladı — \"{houseTitle}\" satışını. Ya o gün gerçeği söyleseydi?", en: "He closed his eyes, remembered that day — the \"{houseTitle}\" sale. What if he had told the truth that day?" },
      { tr: "Zihninde bir an başka bir versiyonu canlandı: daha yavaş, daha dürüst, belki daha az kazançlı ama daha hafif bir vicdan.", en: "For a moment, another version of him came to life in his mind: slower, more honest, maybe less profitable but with a lighter conscience." },
      { tr: "Gözlerini açtığında hâlâ aynı Emlah'tı. O gün değişmedi — ama bir dahakine belki değişir.", en: "When he opened his eyes, he was still the same Estetan. That day didn't change — but maybe next time it will." },
    ],
  },
  "durust-satis": {
    title: { tr: "Bir An İçin Başka Bir Emlah", en: "For a Moment, Another Estetan" },
    paragraphs: [
      { tr: "Gözlerini kapattı, o günü hatırladı — \"{houseTitle}\" satışını. Ya o gün kestirmeden gitseydi?", en: "He closed his eyes, remembered that day — the \"{houseTitle}\" sale. What if he had told the truth that day?" },
      { tr: "Zihninde bir an başka bir versiyonu canlandı: daha hızlı, daha kurnaz, belki daha kazançlı ama tanımadığı bir Emlah.", en: "For a moment, another version of him came to life in his mind: slower, more honest, maybe less profitable but with a lighter conscience." },
      { tr: "Gözlerini açtığında hâlâ aynı Emlah'tı. O gün değişmedi — ve bundan pişman değildi.", en: "When he opened his eyes, he was still the same Estetan. That day didn't change — but maybe next time it will." },
    ],
  },
  "buyuk-kayip": {
    title: { tr: "Bir An İçin Başka Bir Emlah", en: "For a Moment, Another Estetan" },
    paragraphs: [
      { tr: "Gözlerini kapattı, o günü hatırladı — \"{houseTitle}\" satışını kaybettiği günü.", en: "He closed his eyes, remembered that day — the \"{houseTitle}\" sale. What if he had told the truth that day?" },
      { tr: "Zihninde bir an başka bir versiyonu canlandı: bir cümle farklı söylenseydi, belki o ev de cebinde kalırdı.", en: "For a moment, another version of him came to life in his mind: slower, more honest, maybe less profitable but with a lighter conscience." },
      { tr: "Gözlerini açtığında hâlâ aynı Emlah'tı. O gün değişmedi — ama artık bir sonrakini kaçırmayacaktı.", en: "When he opened his eyes, he was still the same Estetan. That day didn't change — but maybe next time it will." },
    ],
  },
};

export function pickFlashbackMemory(memories: SignificantMemory[]): SignificantMemory | null {
  if (memories.length === 0) return null;
  return memories[Math.floor(Math.random() * memories.length)];
}

export function flashbackTextFor(memory: SignificantMemory): { title: string; paragraphs: string[] } {
  const base = flashbackText[memory.kind];
  return {
    title: resolveText(base.title),
    paragraphs: base.paragraphs.map((p) => resolveText(p).replace("{houseTitle}", memory.houseTitle)),
  };
}
