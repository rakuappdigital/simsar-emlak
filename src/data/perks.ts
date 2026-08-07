import type { Perk } from "../types";

export const perks: Perk[] = [
  {
    id: "ikna-kartviziti",
    title: "İkna Kartviziti",
    description: "Bundan sonraki evlerde biriken şüphe %20 daha yavaş artar.",
    cost: 150000,
  },
  {
    id: "sansli-nal",
    title: "Şanslı Nal",
    description: "Bundan sonraki her evde eğlence puanı +10 ile başlarsın.",
    cost: 100000,
  },
  {
    id: "referans-agi",
    title: "Referans Ağı",
    description: "Eski müşterilerin seni tekrar araması ve ikna olması daha olası hale gelir.",
    cost: 180000,
  },
];

export function hasPerk(owned: string[], id: string): boolean {
  return owned.includes(id);
}
