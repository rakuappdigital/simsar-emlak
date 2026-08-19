/**
 * "Konuşma Tarzı" — a device-level preference (localStorage, same pattern
 * as difficulty.ts — not part of any save slot). Deliberately does NOT
 * rewrite Emlah's actual hand-authored lines (real Turkish sentence editing
 * is too easy to get wrong/garbled) — it only ever appends a small, fixed,
 * purely cosmetic suffix to his own spoken lines. "notr" changes nothing at
 * all, matching the game's current behavior exactly.
 */
export type DialogueStyle = "notr" | "esprili" | "resmi";

const KEY = "simsar-emlak-dialogue-style";

export const dialogueStyleLabels: Record<DialogueStyle, string> = {
  notr: "Normal",
  esprili: "Esprili",
  resmi: "Resmi",
};

export function getDialogueStyle(): DialogueStyle {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "notr" || v === "esprili" || v === "resmi") return v;
  } catch {
    // ignore
  }
  return "notr";
}

export function setDialogueStyle(style: DialogueStyle): void {
  try {
    localStorage.setItem(KEY, style);
  } catch {
    // ignore
  }
}

const ESPRILI_SUFFIX_CHANCE = 0.2;
const espriliSuffixes = [" 😄", " 😅", " 😉"];
const RESMI_SUFFIX_CHANCE = 0.2;
const resmiSuffixes = ["!"];

/**
 * Applies the cosmetic suffix to a line already spoken by Emlah. Picked
 * deterministically per (style, text) pair via a tiny hash so the SAME
 * line doesn't flicker between suffixed/unsuffixed across re-renders while
 * still typing out — no per-render Math.random() call.
 */
export function styleEmlahLine(text: string, style: DialogueStyle): string {
  if (style === "notr") return text;
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  const roll = (Math.abs(hash) % 100) / 100;
  if (style === "esprili") {
    if (roll >= ESPRILI_SUFFIX_CHANCE) return text;
    if (/[!?.]$/.test(text)) return text; // don't double up on an already-punctuated ending
    return text + espriliSuffixes[Math.abs(hash) % espriliSuffixes.length];
  }
  // resmi
  if (roll >= RESMI_SUFFIX_CHANCE) return text;
  if (/[!?]$/.test(text)) return text;
  const trimmed = text.replace(/\.$/, "");
  return trimmed + resmiSuffixes[0];
}
