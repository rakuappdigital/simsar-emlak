import type { MemoryKind, SignificantMemory } from "../types";

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

const flashbackText: Record<MemoryKind, { title: string; paragraphs: string[] }> = {
  "kurnaz-satis": {
    title: "Bir An İçin Başka Bir Emlah",
    paragraphs: [
      'Gözlerini kapattı, o günü hatırladı — "{houseTitle}" satışını. Ya o gün gerçeği söyleseydi?',
      "Zihninde bir an başka bir versiyonu canlandı: daha yavaş, daha dürüst, belki daha az kazançlı ama daha hafif bir vicdan.",
      "Gözlerini açtığında hâlâ aynı Emlah'tı. O gün değişmedi — ama bir dahakine belki değişir.",
    ],
  },
  "durust-satis": {
    title: "Bir An İçin Başka Bir Emlah",
    paragraphs: [
      'Gözlerini kapattı, o günü hatırladı — "{houseTitle}" satışını. Ya o gün kestirmeden gitseydi?',
      "Zihninde bir an başka bir versiyonu canlandı: daha hızlı, daha kurnaz, belki daha kazançlı ama tanımadığı bir Emlah.",
      "Gözlerini açtığında hâlâ aynı Emlah'tı. O gün değişmedi — ve bundan pişman değildi.",
    ],
  },
  "buyuk-kayip": {
    title: "Bir An İçin Başka Bir Emlah",
    paragraphs: [
      'Gözlerini kapattı, o günü hatırladı — "{houseTitle}" satışını kaybettiği günü.',
      "Zihninde bir an başka bir versiyonu canlandı: bir cümle farklı söylenseydi, belki o ev de cebinde kalırdı.",
      "Gözlerini açtığında hâlâ aynı Emlah'tı. O gün değişmedi — ama artık bir sonrakini kaçırmayacaktı.",
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
    title: base.title,
    paragraphs: base.paragraphs.map((p) => p.replace("{houseTitle}", memory.houseTitle)),
  };
}
