import { ENERGY_LOW_THRESHOLD, ENERGY_MAX } from "./energy";
import { BOSS_MOOD_RAISE_THRESHOLD, BOSS_MOOD_MAX } from "./bossMood";
import emlahNotr from "../assets/portraits/emlah-notr.webp";
import emlahYorgun from "../assets/portraits/emlah-yorgun.webp";
import emlahGergin from "../assets/portraits/emlah-gergin.webp";
import emlahEnerjik from "../assets/portraits/emlah-enerjik.webp";

/**
 * Emlah'ın kendi portresi — 4 mood variants read straight off two numbers
 * already tracked (energy, bossMood), no new state.
 */
export type EmlahMood = "yorgun" | "gergin" | "enerjik" | "notr";

const ENERGY_HIGH_THRESHOLD = ENERGY_MAX * 0.7;
const BOSS_MOOD_HIGH_THRESHOLD = BOSS_MOOD_MAX * 0.7;

export function emlahMoodFor(energy: number, bossMood: number): EmlahMood {
  if (energy < ENERGY_LOW_THRESHOLD) return "yorgun";
  if (bossMood < BOSS_MOOD_RAISE_THRESHOLD) return "gergin";
  if (energy >= ENERGY_HIGH_THRESHOLD && bossMood >= BOSS_MOOD_HIGH_THRESHOLD) return "enerjik";
  return "notr";
}

export const emlahMoodPortrait: Record<EmlahMood, string> = {
  yorgun: emlahYorgun,
  gergin: emlahGergin,
  enerjik: emlahEnerjik,
  notr: emlahNotr,
};

export const emlahMoodLabel: Record<EmlahMood, string> = {
  yorgun: "yorgun 😴",
  gergin: "gergin 😬",
  enerjik: "enerjik ✨",
  notr: "sakin 🙂",
};
