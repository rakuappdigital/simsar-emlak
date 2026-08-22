import { MINIGAME_ENERGY_GAIN } from "./energy";

/**
 * "Mini Oyunlar" — one of the three energy-recovery paths (see
 * EnergyBreakScreen.tsx). Each activity id maps to a real skill-based
 * mini-game in EnergyMiniGames.tsx; `energyGain` here is the maximum
 * ("great" tier) reward — a weaker "ok"/"fail" result still grants a
 * smaller amount so a play is never wasted. See handleEnergyBreakChoice
 * in App.tsx for the tier → energy mapping.
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
