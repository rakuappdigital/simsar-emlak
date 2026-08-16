import { perks } from "./perks";

/**
 * Office background art, one per furnishing tier — loaded on demand just
 * like house art (see houseImages.ts). Empty until real art is supplied;
 * `loadOfficeImage` gracefully returns null for any tier with no loader
 * yet, so the OfficeScene falls back to its themed placeholder gradient.
 *
 * To wire in real art later, add entries here exactly like houseImages.ts:
 *   1: () => import("../assets/office/ofis-1.webp"),
 */
const loaders: Record<number, () => Promise<{ default: string }>> = {};

const cache: Record<number, string> = {};

const OFIS_ITEM_COUNT = perks.filter((p) => p.category === "ofis").length;

/** How many "Ofis Ekipmanı" market items are currently owned. */
export function countOwnedOfisItems(ownedPerks: string[]): number {
  return perks.filter((p) => p.category === "ofis" && ownedPerks.includes(p.id)).length;
}

/**
 * Office art tier follows what's actually been bought from the "Ofis
 * Ekipmanı" market category (not career rank) — buying furniture is what
 * visibly furnishes the office, tier by tier, out of OFIS_ITEM_COUNT total.
 */
export function officeTierForOwnedPerks(ownedPerks: string[]): number {
  const owned = countOwnedOfisItems(ownedPerks);
  if (owned === 0) return 1;
  if (owned <= 2) return 2;
  if (owned <= OFIS_ITEM_COUNT - 2) return 3;
  return 4;
}

export function loadOfficeImage(tier: number): Promise<string> | null {
  if (cache[tier]) return Promise.resolve(cache[tier]);
  const loader = loaders[tier];
  if (!loader) return null;
  return loader().then((mod) => {
    cache[tier] = mod.default;
    return mod.default;
  });
}

export function peekOfficeImage(tier: number): string | undefined {
  return cache[tier];
}
