import type { CompassAxis } from "../types";
import type { Localized } from "./language";

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

export const selfReflectionText: Record<ReflectionKind, { title: Localized; paragraphs: Localized[] }> = {
  kurnaz: {
    title: { tr: "Emlah'ın Boş Sayfası", en: "Estetan's Blank Page" },
    paragraphs: [
      { tr: "Gece geç saatte, günün son evrakını imzaladıktan sonra, defterini açtı.", en: "Late at night, after signing the last paperwork of the day, he opened his notebook." },
      { tr: "\"Bugün yine bir şeyi atlattım. İyi bir pazarlıktı diyorum kendime, ama içimde bir yer biliyor ki bu kadar kolay olmamalıydı.\"", en: "\"I slipped out of something again today. I tell myself it was a good negotiation, but a part of me knows it shouldn't have been this easy.\"" },
      { tr: "\"Belki de artık bu işin böyle yürüdüğünü kabul etmem gerekiyor. Ya da belki henüz kabul etmemek için bir sebebim var.\"", en: "\"Maybe I need to accept that this is how this business works now. Or maybe I have a reason not to accept it just yet.\"" },
      { tr: "Defteri kapattı, ışığı söndürdü. Yarın yine bir kapı çalacaktı.", en: "He closed the notebook, turned off the light. Tomorrow another door would knock again." },
    ],
  },
  durust: {
    title: { tr: "Emlah'ın Boş Sayfası", en: "Estetan's Blank Page" },
    paragraphs: [
      { tr: "Gece geç saatte, günün son evrakını imzaladıktan sonra, defterini açtı.", en: "Late at night, after signing the last paperwork of the day, he opened his notebook." },
      { tr: "\"Bugün de doğruyu söyledim, yine kolay yoldan gitmedim. Bazen bunun bir bedeli oluyor ama pişman değilim.\"", en: "\"I told the truth today too, didn't take the easy way out again. Sometimes this comes with a price, but I have no regrets.\"" },
      { tr: "\"Belki bu işte kazanan hep en hızlı olan değildir. Belki de sonunda hatırlanan, doğru olandır.\"", en: "\"Maybe the winner in this business isn't always the fastest. Maybe what gets remembered in the end is what is right.\"" },
      { tr: "Defteri kapattı, ışığı söndürdü. Yarın yine bir kapı çalacaktı — ama bu kez içi rahattı.", en: "He closed the notebook, turned off the light. Tomorrow another door would knock again — but this time his mind was at ease." },
    ],
  },
};
