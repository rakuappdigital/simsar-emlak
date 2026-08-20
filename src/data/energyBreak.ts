/**
 * "Enerji Molası" — when energy drops below ENERGY_WORK_MIN_THRESHOLD,
 * Emlah can't take on today's job until he recovers a bit. These four
 * quick breaks are the placeholder activities for that recovery window;
 * later they can each become a real mini-game (their id/energyGain shape
 * is designed to survive that swap unchanged — just replace what happens
 * on selection).
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
    energyGain: 18,
    flavorLine: "Sertçe bir kahve içti, gözleri hemen açıldı.",
  },
  {
    id: "muzik",
    label: "Müzik Dinle",
    icon: "🎧",
    energyGain: 14,
    flavorLine: "Birkaç şarkı dinleyince kafası toparlandı.",
  },
  {
    id: "yuruyus",
    label: "Kısa Yürüyüş",
    icon: "🚶",
    energyGain: 24,
    flavorLine: "Dışarıda birkaç tur attı, ferahladı.",
  },
  {
    id: "sekerleme",
    label: "Masada Şekerleme",
    icon: "😴",
    energyGain: 30,
    flavorLine: "On dakikalık bir şekerleme her şeyi değiştirdi.",
  },
];
