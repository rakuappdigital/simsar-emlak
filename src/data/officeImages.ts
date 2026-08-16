/**
 * Office background art, one per career-rank tier — loaded on demand just
 * like house art (see houseImages.ts). Empty until real art is supplied;
 * `loadOfficeImage` gracefully returns null for any tier with no loader
 * yet, so the OfficeScene falls back to its themed placeholder gradient.
 *
 * To wire in real art later, add entries here exactly like houseImages.ts:
 *   1: () => import("../assets/office/ofis-1.webp"),
 */
const loaders: Record<number, () => Promise<{ default: string }>> = {};

const cache: Record<number, string> = {};

/** Career rank -> office art tier (1-4, matches rankTitle()'s four possible values). */
export function officeTierForRank(rankTitleText: string): number {
  switch (rankTitleText) {
    case "Ofis Ortağı":
      return 4;
    case "Kıdemli Emlakçı":
      return 3;
    case "Emlakçı":
      return 2;
    default:
      return 1;
  }
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
