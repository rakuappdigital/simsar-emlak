export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shuffledRange(n: number): number[] {
  return shuffle(Array.from({ length: n }, (_, i) => i));
}

/**
 * Shuffles indices within each tier, then concatenates tiers in order (tier 1
 * first, tier 3 last). Guarantees cheap houses come first as a natural
 * difficulty ramp, and expensive ones only show up once you've had a few
 * weeks of income to unlock them — without ever hard-blocking progress.
 */
export function tieredShuffle(tiers: number[]): number[] {
  const byTier = new Map<number, number[]>();
  tiers.forEach((tier, index) => {
    if (!byTier.has(tier)) byTier.set(tier, []);
    byTier.get(tier)!.push(index);
  });
  const orderedTiers = [...byTier.keys()].sort((a, b) => a - b);
  return orderedTiers.flatMap((tier) => shuffle(byTier.get(tier)!));
}
