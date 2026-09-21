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

export const energyBreakActivities: EnergyBreakActivity[] = [
  {
    id: "anahtar",
    label: { tr: "Anahtar Bul", en: "Find the Key" },
    icon: "🔑",
    energyGain: MINIGAME_ENERGY_GAIN,
    flavorLine: { tr: "Doğru anahtarı hızlıca buldu, kafası dağıldı.", en: "Spotted the right key fast, cleared his head." },
  },
  {
    id: "mesaj-sirala",
    label: { tr: "Mesajları Sırala", en: "Sort the Messages" },
    icon: "📱",
    energyGain: MINIGAME_ENERGY_GAIN,
    flavorLine: { tr: "Mesajları toparlayınca kafası da toparlandı.", en: "Sorting the messages sorted his head out too." },
  },
  {
    id: "yuruyus",
    label: { tr: "Kısa Yürüyüş", en: "Short Walk" },
    icon: "🚶",
    energyGain: MINIGAME_ENERGY_GAIN,
    flavorLine: { tr: "Dışarıda birkaç tur attı, ferahladı.", en: "Took a few laps outside, refreshed." },
  },
  {
    id: "fiyat-tahmin",
    label: { tr: "Fiyat Tahmin Et", en: "Guess the Price" },
    icon: "🏷️",
    energyGain: MINIGAME_ENERGY_GAIN,
    flavorLine: { tr: "Fiyat tahmini yapınca işine biraz daha yaklaştı.", en: "Guessing the price got him back in the zone." },
  },
];
