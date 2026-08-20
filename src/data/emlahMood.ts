import { ENERGY_LOW_THRESHOLD, ENERGY_MAX } from "./energy";
import { BOSS_MOOD_RAISE_THRESHOLD, BOSS_MOOD_MAX } from "./bossMood";

/**
 * Emlah'ın kendi portresi — 4 mood variants read straight off two numbers
 * already tracked (energy, bossMood), no new state. "notr" reuses the
 * existing emlah.webp; the other three are new art (see prompts delivered
 * to the user) referenced only as string keys until the files exist, same
 * build-safety rule as rivalCharacter.ts's Fırat portraits.
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

export const emlahMoodPortraitKey: Record<EmlahMood, string> = {
  yorgun: "emlah-yorgun",
  gergin: "emlah-gergin",
  enerjik: "emlah-enerjik",
  notr: "emlah-notr",
};

export const emlahMoodLabel: Record<EmlahMood, string> = {
  yorgun: "yorgun 😴",
  gergin: "gergin 😬",
  enerjik: "enerjik ✨",
  notr: "sakin 🙂",
};
