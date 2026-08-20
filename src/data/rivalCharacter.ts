import type { DialogueLine } from "../types";

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
  /** Filename key for the (not-yet-created) portrait — see the art prompt this feature ships with. */
  portraitKey: string;
  lines: DialogueLine[];
}

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
