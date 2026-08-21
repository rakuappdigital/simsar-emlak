/**
 * "Şehrin Kurtları" — Fırat Bey is now the first rung of a 5-person rival
 * ladder instead of the only rival in the game. Defeating one (your total
 * sold count reaching their threshold) retires them and puts the next name
 * on the "active" duel slot used by rivalDuel.ts's RIVAL_DUEL_CHANCE roll —
 * that roll and its bonus-only mechanic are completely untouched, this
 * just decides whose name shows up in it. Ladder rivals 2-5 are
 * intentionally text-only for now (no mood portraits/bespoke dialogue like
 * Fırat has) — a smaller, safer scope than redoing his whole encounter
 * system four more times.
 */
export interface RivalLadderEntry {
  id: string;
  name: string;
  title: string;
  /** Total lifetime sold-house count needed to retire this rival and advance the ladder. */
  threshold: number;
  victoryLine: string;
}

export const rivalLadder: RivalLadderEntry[] = [
  {
    id: "firat",
    name: "Fırat Bey",
    title: "Mahallenin Kurdu",
    threshold: 5,
    victoryLine: "Fırat Bey artık senden çekiniyor — bölgedeki ilk rakibini geride bıraktın.",
  },
  {
    id: "nesrin",
    name: "Nesrin Hanım",
    title: "Sessiz Tehdit",
    threshold: 12,
    victoryLine: "Nesrin Hanım'ın sessiz sakin taktikleri bile seni durduramadı.",
  },
  {
    id: "yavuz",
    name: "Kaptan Yavuz",
    title: "Agresif Satıcı",
    threshold: 20,
    victoryLine: "Kaptan Yavuz'un baskıcı taktikleri işe yaramadı — onu da geçtin.",
  },
  {
    id: "berrak",
    name: "Berrak Hanım",
    title: "Kurumsal Soğukluk",
    threshold: 30,
    victoryLine: "Berrak Hanım'ın kurumsal ekibi bile senin hızına yetişemedi.",
  },
  {
    id: "selcuk",
    name: "Selçuk Bey",
    title: "Şehrin Efsanesi",
    threshold: 42,
    victoryLine: "Şehrin efsanevi ismi Selçuk Bey'i de geçtin — artık bu şehrin en iyisi sensin.",
  },
];

export function activeRivalFor(defeatedRivalIds: string[]): RivalLadderEntry {
  return rivalLadder.find((r) => !defeatedRivalIds.includes(r.id)) ?? rivalLadder[rivalLadder.length - 1];
}

export function ladderPositionFor(defeatedRivalIds: string[]): number {
  return Math.min(defeatedRivalIds.length + 1, rivalLadder.length);
}
