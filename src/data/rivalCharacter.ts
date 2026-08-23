import type { DialogueLine } from "../types";
import firatKendindenEmin from "../assets/portraits/firat-kendinden-emin.webp";
import firatGergin from "../assets/portraits/firat-gergin.webp";
import firatNotr from "../assets/portraits/firat-notr.webp";

/**
 * Fırat Bey — previously just a name in flavor text (weekly news, the silent
 * rivalDuel.ts bonus). This gives him an actual face: when the existing
 * RIVAL_DUEL_CHANCE roll fires, DialogueScene now ALSO prepends a short,
 * mood-specific face-to-face exchange (same prepend mechanism as
 * easterEggs.ts/celebrities.ts) instead of just the small "⏱️" tag. This
 * deepens the existing rival system rather than adding a new one — the
 * underlying bonus-only mechanic in rivalDuel.ts is untouched.
 */
export type FiratMood = "kendinden-emin" | "gergin" | "notr";

export interface FiratMoodDef {
  mood: FiratMood;
  portraitKey: string;
  lines: DialogueLine[];
}

export const firatPortraits: Record<string, string> = {
  "firat-kendinden-emin": firatKendindenEmin,
  "firat-gergin": firatGergin,
  "firat-notr": firatNotr,
};

const kendindenEminLines: DialogueLine[] = [
  { speaker: "system", name: "Fırat Bey", text: "(kapıdan başını uzatır) Emlah'ım, sen de mi bu daireye göz koydun?" },
  { speaker: "system", name: "Fırat Bey", text: "Boş ver, ben zaten sahibiyle görüştüm bile — ama sen dene canım, hakkını yeme." },
  { speaker: "thought", text: "(içinden) Bu kadar rahat olması hiç iyiye işaret değil." },
];

const gerginLines: DialogueLine[] = [
  { speaker: "system", name: "Fırat Bey", text: "(aceleyle içeri girer) Emlah, bu ay hiç iyi gitmiyor, biliyorsun değil mi?" },
  { speaker: "system", name: "Fırat Bey", text: "Bu evi de kaçırırsam ofis beni gerçekten sorgulayacak. Neyse, sen işine bak, ben de bakarım." },
  { speaker: "thought", text: "(içinden) Fırat Bey'i bu kadar gergin görmemiştim — bu sefer işim kolay olabilir." },
];

const notrLines: DialogueLine[] = [
  { speaker: "system", name: "Fırat Bey", text: "(elini uzatır) Emlah, yine aynı bölgede karşılaştık — meslek böyle bir şey işte." },
  { speaker: "system", name: "Fırat Bey", text: "Kazanan kazanır, iş burada biter. Kolay gelsin." },
  { speaker: "thought", text: "(içinden) Fırat Bey ile aramızda hep bir centilmenlik oldu, en azından şimdilik." },
];

export const firatMoods: FiratMoodDef[] = [
  { mood: "kendinden-emin", portraitKey: "firat-kendinden-emin", lines: kendindenEminLines },
  { mood: "gergin", portraitKey: "firat-gergin", lines: gerginLines },
  { mood: "notr", portraitKey: "firat-notr", lines: notrLines },
];

/**
 * Fırat's mood reflects the same cosmetic rivalTotalSales() comparison
 * already used on the career/week screens — never reads real scoring data,
 * purely flavor, matching rival.ts's existing "never read by gameplay" rule.
 */
export function firatMoodFor(playerSoldCount: number, rivalTotal: number): FiratMoodDef {
  const diff = playerSoldCount - rivalTotal;
  if (diff >= 3) return firatMoods[1]; // gergin — açıkça geride kalmış
  if (diff <= -3) return firatMoods[0]; // kendinden emin — açıkça önde
  return firatMoods[2]; // notr — baş başa
}

/**
 * "Tam Çember" — Fırat kicked off the rival ladder (rivalLadder.ts) as its
 * first, richest-voiced rung; once the WHOLE ladder is cleared (all 5
 * rivals retired), he gets a one-time narrative close instead of just
 * fading out after his own early defeat. Delivered as a plain inbox
 * message sequence (same pattern as secondChanceEvent.ts/breadth
 * confrontation) rather than a live in-dialogue encounter — no house
 * context needed for this, and it keeps the risk to a single new file
 * addition instead of touching the duel/encounter machinery.
 */
export const firatFullCircleLines: string[] = [
  "Emlah, bir dakikan var mı?",
  "Bu şehirdeki herkesi geçtiğini duydum. Başta biraz canım sıkıldı, itiraf edeyim.",
  "Ama artık seni rakip değil, meslektaş olarak görüyorum. Hakkını verdin.",
  "Belki bir gün birlikte iş yaparız, kim bilir. Kolay gelsin, şampiyon.",
];
