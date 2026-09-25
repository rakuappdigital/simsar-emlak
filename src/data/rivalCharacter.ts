import type { DialogueLine } from "../types";
import firatKendindenEmin from "../assets/portraits/firat-kendinden-emin.webp";
import firatGergin from "../assets/portraits/firat-gergin.webp";
import firatNotr from "../assets/portraits/firat-notr.webp";
import type { Localized } from "./language";

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
  { speaker: "system", name: "Fırat Bey", text: { tr: "(kapıdan başını uzatır) Emlah'ım, sen de mi bu daireye göz koydun?", en: "(poking his head through the door) Estetan my boy, did you set your sights on this apartment too?" } },
  { speaker: "system", name: "Fırat Bey", text: { tr: "Boş ver, ben zaten sahibiyle görüştüm bile — ama sen dene canım, hakkını yeme.", en: "Never mind, I already talked with the owner — but give it a try buddy, don't let me stop you." } },
  { speaker: "thought", text: { tr: "(içinden) Bu kadar rahat olması hiç iyiye işaret değil.", en: "(to himself) Him being this relaxed is not a good sign at all." } },
];

const gerginLines: DialogueLine[] = [
  { speaker: "system", name: "Fırat Bey", text: { tr: "(aceleyle içeri girer) Emlah, bu ay hiç iyi gitmiyor, biliyorsun değil mi?", en: "(rushing inside) Estetan, this month is not going well at all, you know that right?" } },
  { speaker: "system", name: "Fırat Bey", text: { tr: "Bu evi de kaçırırsam ofis beni gerçekten sorgulayacak. Neyse, sen işine bak, ben de bakarım.", en: "If I miss out on this house too, the office will really question me. Anyway, you mind your business, I'll mind mine." } },
  { speaker: "thought", text: { tr: "(içinden) Fırat Bey'i bu kadar gergin görmemiştim — bu sefer işim kolay olabilir.", en: "(to himself) I haven't seen Fırat Bey this tense before — my job might be easy this time." } },
];

const notrLines: DialogueLine[] = [
  { speaker: "system", name: "Fırat Bey", text: { tr: "(elini uzatır) Emlah, yine aynı bölgede karşılaştık — meslek böyle bir şey işte.", en: "(extending his hand) Estetan, we ran into each other in the same district again — that's what the profession is about." } },
  { speaker: "system", name: "Fırat Bey", text: { tr: "Kazanan kazanır, iş burada biter. Kolay gelsin.", en: "Winner wins, business ends here. Good luck." } },
  { speaker: "thought", text: { tr: "(içinden) Fırat Bey ile aramızda hep bir centilmenlik oldu, en azından şimdilik.", en: "(to himself) There has always been a gentlemen's agreement between Fırat Bey and me, at least for now." } },
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
export const firatFullCircleLines: Localized[] = [
  { tr: "Emlah, bir dakikan var mı?", en: "Estetan, do you have a minute?" },
  { tr: "Bu şehirdeki herkesi geçtiğini duydum. Başta biraz canım sıkıldı, itiraf edeyim.", en: "I heard you passed everyone in this city. I was a bit bummed at first, I admit." },
  { tr: "Ama artık seni rakip değil, meslektaş olarak görüyorum. Hakkını verdin.", en: "But now I see you not as a rival, but as a colleague. You earned it." },
  { tr: "Belki bir gün birlikte iş yaparız, kim bilir. Kolay gelsin, şampiyon.", en: "Maybe one day we do business together, who knows. Good luck, champ." },
];
