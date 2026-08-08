import type { HouseScene, PoolCharacter } from "../types";
import { shuffle } from "./shuffle";

import k1 from "../assets/portraits/k1.webp";
import k2 from "../assets/portraits/k2.webp";
import k3 from "../assets/portraits/k3.webp";
import k4 from "../assets/portraits/k4.webp";
import k5 from "../assets/portraits/k5.webp";
import k6 from "../assets/portraits/k6.webp";
import k7 from "../assets/portraits/k7.webp";
import k8 from "../assets/portraits/k8.webp";
import k9 from "../assets/portraits/k9.webp";
import k10 from "../assets/portraits/k10.webp";
import k11 from "../assets/portraits/k11.webp";
import k12 from "../assets/portraits/k12.webp";
import k13 from "../assets/portraits/k13.webp";
import k14 from "../assets/portraits/k14.webp";
import k15 from "../assets/portraits/k15.webp";
import k16 from "../assets/portraits/k16.webp";
import k17 from "../assets/portraits/k17.webp";
import k18 from "../assets/portraits/k18.webp";
import k19 from "../assets/portraits/k19.webp";
import k20 from "../assets/portraits/k20.webp";
import k21 from "../assets/portraits/k21.webp";
import k22 from "../assets/portraits/k22.webp";
import k23 from "../assets/portraits/k23.webp";
import k24 from "../assets/portraits/k24.webp";
import k25 from "../assets/portraits/k25.webp";
import k26 from "../assets/portraits/k26.webp";
import k27 from "../assets/portraits/k27.webp";
import k28 from "../assets/portraits/k28.webp";
import k29 from "../assets/portraits/k29.webp";
import k30 from "../assets/portraits/k30.webp";
import k31 from "../assets/portraits/k31.webp";
import k32 from "../assets/portraits/k32.webp";
import k33 from "../assets/portraits/k33.webp";
import k34 from "../assets/portraits/k34.webp";
import k35 from "../assets/portraits/k35.webp";
import k36 from "../assets/portraits/k36.webp";
import k37 from "../assets/portraits/k37.webp";
import k38 from "../assets/portraits/k38.webp";
import k39 from "../assets/portraits/k39.webp";
import k40 from "../assets/portraits/k40.webp";

/**
 * Shared pool of reusable customer identities, decoupled from any single
 * house. Filename convention for portraits: "k" prefix for female
 * characters (k1, k2, ...), "e" prefix for male characters (e1, e2, ...)
 * — same prefix as the pool character's `id`.
 *
 * Add more entries here as portraits/names come in; nothing else needs to
 * change — `assignCast` and the portrait lookup below pick them up
 * automatically. None of the current 20 hand-authored houses reference
 * this pool yet (no `dynamicCast`) — it's ready for future houses.
 */
export const characterPool: PoolCharacter[] = [
  { id: "k1", gender: "k", name: "Aysel" },
  { id: "k2", gender: "k", name: "Gönül" },
  { id: "k3", gender: "k", name: "Sevgi" },
  { id: "k4", gender: "k", name: "Nurten" },
  { id: "k5", gender: "k", name: "Türkan" },
  { id: "k6", gender: "k", name: "Aylin" },
  { id: "k7", gender: "k", name: "Ceyda" },
  { id: "k8", gender: "k", name: "Şebnem" },
  { id: "k9", gender: "k", name: "Hande" },
  { id: "k10", gender: "k", name: "Gizem" },
  { id: "k11", gender: "k", name: "Ceren" },
  { id: "k12", gender: "k", name: "İrem" },
  { id: "k13", gender: "k", name: "Nehir" },
  { id: "k14", gender: "k", name: "Arya" },
  { id: "k15", gender: "k", name: "Su" },
  { id: "k16", gender: "k", name: "Ayşe" },
  { id: "k17", gender: "k", name: "Fatma" },
  { id: "k18", gender: "k", name: "Hatice" },
  { id: "k19", gender: "k", name: "Zeynep" },
  { id: "k20", gender: "k", name: "Elif" },
  { id: "k21", gender: "k", name: "Esra" },
  { id: "k22", gender: "k", name: "Merve" },
  { id: "k23", gender: "k", name: "Burcu" },
  { id: "k24", gender: "k", name: "Özge" },
  { id: "k25", gender: "k", name: "Sinem" },
  { id: "k26", gender: "k", name: "Didem" },
  { id: "k27", gender: "k", name: "Büşra" },
  { id: "k28", gender: "k", name: "Yasemin" },
  { id: "k29", gender: "k", name: "Tuğba" },
  { id: "k30", gender: "k", name: "Ece" },
  { id: "k31", gender: "k", name: "Nil" },
  { id: "k32", gender: "k", name: "Derin" },
  { id: "k33", gender: "k", name: "Defne" },
  { id: "k34", gender: "k", name: "Selin" },
  { id: "k35", gender: "k", name: "Pelin" },
  { id: "k36", gender: "k", name: "Melis" },
  { id: "k37", gender: "k", name: "Asya" },
  { id: "k38", gender: "k", name: "Doğa" },
  { id: "k39", gender: "k", name: "Masal" },
  { id: "k40", gender: "k", name: "Alara" },
];

/**
 * Portrait images for pool characters, keyed by PoolCharacter.id. Populated
 * the same way src/data/characterImages.ts is: import each webp and add an
 * entry here once the asset exists.
 */
export const poolPortraits: Record<string, string> = {
  k1, k2, k3, k4, k5, k6, k7, k8, k9, k10,
  k11, k12, k13, k14, k15, k16, k17, k18, k19, k20,
  k21, k22, k23, k24, k25, k26, k27, k28, k29, k30,
  k31, k32, k33, k34, k35, k36, k37, k38, k39, k40,
};

/**
 * Randomly assigns pool characters to every house with a `dynamicCast`,
 * respecting each slot's gender constraint (if any) and never reusing the
 * same character twice in one game. Houses without `dynamicCast` are
 * skipped entirely — their hand-authored `customerNames` are used as-is.
 *
 * If the pool runs out of unique matches (e.g. more dynamic slots than
 * pool characters of a given gender), it wraps around and reuses — better
 * than leaving a slot empty, and unlikely to matter until the pool is
 * meaningfully sized.
 */
export function assignCast(houses: HouseScene[]): Record<string, string[]> {
  const assignment: Record<string, string[]> = {};
  if (characterPool.length === 0) return assignment;

  const shuffledPool = shuffle(characterPool);
  const used = new Set<string>();

  function pickFor(gender: PoolCharacter["gender"] | undefined): PoolCharacter {
    const candidates = gender ? shuffledPool.filter((c) => c.gender === gender) : shuffledPool;
    const fresh = candidates.find((c) => !used.has(c.id));
    const chosen = fresh ?? candidates[Math.floor(Math.random() * candidates.length)];
    used.add(chosen.id);
    return chosen;
  }

  for (const house of houses) {
    if (!house.dynamicCast || house.dynamicCast.length === 0) continue;
    assignment[house.id] = house.dynamicCast.map((slot) => pickFor(slot.gender).id);
  }
  return assignment;
}

export function resolveCustomerNames(house: HouseScene, assignment: Record<string, string[]>): string[] {
  if (!house.dynamicCast) return house.customerNames;
  const ids = assignment[house.id] ?? [];
  return ids.map((id) => characterPool.find((c) => c.id === id)?.name ?? "Müşteri");
}

export function resolvePortrait(name: string, house: HouseScene, assignment: Record<string, string[]>): string | undefined {
  if (!house.dynamicCast) return undefined;
  const ids = assignment[house.id] ?? [];
  const names = resolveCustomerNames(house, assignment);
  const slotIndex = names.indexOf(name);
  if (slotIndex === -1) return undefined;
  return poolPortraits[ids[slotIndex]];
}

/** Replaces {isim} / {isim2} tokens in authored dialogue text with the assigned customer name(s). */
export function interpolateNames(text: string, names: string[]): string {
  return text.replace(/\{isim\}/g, names[0] ?? "").replace(/\{isim2\}/g, names[1] ?? "");
}
