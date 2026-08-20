import type { CompassAxis } from "../types";

/**
 * "Emlah'ın Boş Sayfası" — a single, one-time reflective moment (not a
 * mirror metaphor per the brief) triggered when the Değerler Pusulası
 * reaches a real extreme. Emlah sits down with his own notebook — the same
 * "günlük" motif journal.ts already uses — and writes a page to himself.
 * Pure text, one-time, gated behind an already-persisted tally; adds no new
 * ongoing system, just a rare payoff reusing existing data.
 */
export type ReflectionKind = "kurnaz" | "durust";

const EXTREME_THRESHOLD = 15;
const MIN_TOTAL_FOR_TRIGGER = 20;

export function checkSelfReflectionTrigger(tally: Record<CompassAxis, number>): ReflectionKind | null {
  const total = tally.durustluk + tally.kurnazlik;
  if (total < MIN_TOTAL_FOR_TRIGGER) return null;
  const diff = tally.kurnazlik - tally.durustluk;
  if (diff >= EXTREME_THRESHOLD) return "kurnaz";
  if (-diff >= EXTREME_THRESHOLD) return "durust";
  return null;
}

export const selfReflectionText: Record<ReflectionKind, { title: string; paragraphs: string[] }> = {
  kurnaz: {
    title: "Emlah'ın Boş Sayfası",
    paragraphs: [
      "Gece geç saatte, günün son evrakını imzaladıktan sonra, defterini açtı.",
      "\"Bugün yine bir şeyi atlattım. İyi bir pazarlıktı diyorum kendime, ama içimde bir yer biliyor ki bu kadar kolay olmamalıydı.\"",
      "\"Belki de artık bu işin böyle yürüdüğünü kabul etmem gerekiyor. Ya da belki henüz kabul etmemek için bir sebebim var.\"",
      "Defteri kapattı, ışığı söndürdü. Yarın yine bir kapı çalacaktı.",
    ],
  },
  durust: {
    title: "Emlah'ın Boş Sayfası",
    paragraphs: [
      "Gece geç saatte, günün son evrakını imzaladıktan sonra, defterini açtı.",
      "\"Bugün de doğruyu söyledim, yine kolay yoldan gitmedim. Bazen bunun bir bedeli oluyor ama pişman değilim.\"",
      "\"Belki bu işte kazanan hep en hızlı olan değildir. Belki de sonunda hatırlanan, doğru olandır.\"",
      "Defteri kapattı, ışığı söndürdü. Yarın yine bir kapı çalacaktı — ama bu kez içi rahattı.",
    ],
  },
};
