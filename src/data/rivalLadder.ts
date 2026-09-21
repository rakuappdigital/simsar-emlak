import type { Localized } from "./language";
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
  title: Localized;
  /** Total lifetime sold-house count needed to retire this rival and advance the ladder. */
  threshold: number;
  victoryLine: Localized;
}

export const rivalLadder: RivalLadderEntry[] = [
  {
    id: "firat",
    name: "Fırat Bey",
    title: { tr: "Mahallenin Kurdu", en: "Neighborhood Wolf" },
    threshold: 5,
    victoryLine: { tr: "Fırat Bey artık senden çekiniyor — bölgedeki ilk rakibini geride bıraktın.", en: "Fırat Bey is wary of you now — you left your first rival in the district behind." },
  },
  {
    id: "nesrin",
    name: "Nesrin Hanım",
    title: { tr: "Sessiz Tehdit", en: "Silent Threat" },
    threshold: 12,
    victoryLine: { tr: "Nesrin Hanım'ın sessiz sakin taktikleri bile seni durduramadı.", en: "Even Nesrin Hanım's quiet and calm tactics couldn't stop you." },
  },
  {
    id: "yavuz",
    name: "Kaptan Yavuz",
    title: { tr: "Agresif Satıcı", en: "Aggressive Seller" },
    threshold: 20,
    victoryLine: { tr: "Kaptan Yavuz'un baskıcı taktikleri işe yaramadı — onu da geçtin.", en: "Captain Yavuz's pushy tactics didn't work — you passed him too." },
  },
  {
    id: "berrak",
    name: "Berrak Hanım",
    title: { tr: "Kurumsal Soğukluk", en: "Corporate Coldness" },
    threshold: 30,
    victoryLine: { tr: "Berrak Hanım'ın kurumsal ekibi bile senin hızına yetişemedi.", en: "Even Berrak Hanım's corporate team couldn't keep up with your speed." },
  },
  {
    id: "selcuk",
    name: "Selçuk Bey",
    title: { tr: "Şehrin Efsanesi", en: "City Legend" },
    threshold: 42,
    victoryLine: { tr: "Şehrin efsanevi ismi Selçuk Bey'i de geçtin — artık bu şehrin en iyisi sensin.", en: "You surpassed the legendary name of the city, Selçuk Bey — now you are the best in this city." },
  },
];

export function activeRivalFor(defeatedRivalIds: string[]): RivalLadderEntry {
  return rivalLadder.find((r) => !defeatedRivalIds.includes(r.id)) ?? rivalLadder[rivalLadder.length - 1];
}

export function ladderPositionFor(defeatedRivalIds: string[]): number {
  return Math.min(defeatedRivalIds.length + 1, rivalLadder.length);
}
