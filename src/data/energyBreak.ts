import { MINIGAME_ENERGY_GAIN } from "./energy";
import type { Localized } from "./language";

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
  label: Localized;
  icon: string;
  energyGain: number;
  flavorLine: Localized;
}

// Trimmed from 4 to the 2 clearest mini-games — "Sort the Messages" (ordering
// logic) and "Guess the Price" (no real information to reason from, pure
// luck disguised as a choice) were the main source of player confusion.
export const energyBreakActivities: EnergyBreakActivity[] = [
  {
    id: "anahtar",
    label: { tr: "Anahtar Bul", en: "Find the Key" },
    icon: "key",
    energyGain: MINIGAME_ENERGY_GAIN,
    flavorLine: { tr: "Doğru anahtarı hızlıca buldu, kafası dağıldı.", en: "Spotted the right key fast, cleared his head." },
  },
  {
    id: "yuruyus",
    label: { tr: "Kısa Yürüyüş", en: "Short Walk" },
    icon: "walk",
    energyGain: MINIGAME_ENERGY_GAIN,
    flavorLine: { tr: "Dışarıda birkaç tur attı, ferahladı.", en: "Took a few laps outside, refreshed." },
  },
];
