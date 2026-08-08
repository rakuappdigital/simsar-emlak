import type { HouseScene, PoolCharacter } from "../types";
import { shuffle } from "./shuffle";

/**
 * Shared pool of reusable customer identities, decoupled from any single
 * house. Filename convention for portraits (once added): "k" prefix for
 * female characters (k1, k2, ...), "e" prefix for male characters
 * (e1, e2, ...) — same prefix as the pool character's `id`.
 *
 * Empty for now. Add entries here as portraits/names come in; nothing
 * else needs to change — `assignCast` and the portrait lookup below pick
 * them up automatically.
 */
export const characterPool: PoolCharacter[] = [];

/**
 * Portrait images for pool characters, keyed by PoolCharacter.id. Populated
 * the same way src/data/characterImages.ts is: import each webp and add an
 * entry here once the asset exists.
 */
export const poolPortraits: Record<string, string> = {};

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
