import { MINIGAME_ENERGY_GAIN } from "./energy";

/**
 * "Mini Oyunlar" — one of the three energy-recovery paths (see
 * EnergyBreakScreen.tsx). Placeholder activities for now — a click is an
 * automatic "win" since no real mini-game mechanic exists yet; later each
 * card's onSelect can be swapped for a real skill-based mini-game without
 * touching the surrounding cooldown/plays-remaining system, which already
 * only cares about win/no-win.
 */
export interface EnergyBreakActivity {
  id: string;
  label: string;
  icon: string;
  energyGain: number;
  flavorLine: string;
}

export const energyBreakActivities: EnergyBreakActivity[] = [
  {
    id: "kahve",
    label: "Kahve Molası",
    icon: "☕",
    energyGain: MINIGAME_ENERGY_GAIN,
    flavorLine: "Sertçe bir kahve içti, gözleri hemen açıldı.",
  },
  {
    id: "muzik",
    label: "Müzik Dinle",
    icon: "🎧",
    energyGain: MINIGAME_ENERGY_GAIN,
    flavorLine: "Birkaç şarkı dinleyince kafası toparlandı.",
  },
  {
    id: "yuruyus",
    label: "Kısa Yürüyüş",
    icon: "🚶",
    energyGain: MINIGAME_ENERGY_GAIN,
    flavorLine: "Dışarıda birkaç tur attı, ferahladı.",
  },
  {
    id: "sekerleme",
    label: "Masada Şekerleme",
    icon: "😴",
    energyGain: MINIGAME_ENERGY_GAIN,
    flavorLine: "On dakikalık bir şekerleme her şeyi değiştirdi.",
  },
];
