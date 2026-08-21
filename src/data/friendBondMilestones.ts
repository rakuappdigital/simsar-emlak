/**
 * Sosyal Bağ Seviyeleri — a silent, purely cosmetic counter per friend
 * character (Ecrin/Kutay/Bengisu/Alperen/Duru), incremented once per
 * houseTip interaction (see friendFlavor.ts). Crossing a threshold fires a
 * ONE-TIME celebratory inbox message from that friend and nothing else —
 * no stat bonus, no new UI panel yet. A natural home for a future
 * "Başarılar" collectible screen, per the brief.
 */
export const FRIEND_BOND_MILESTONES = [3, 6, 10];

const milestoneLines: Record<number, (name: string) => string> = {
  3: (name) => `${name}: Aramızda güzel bir bağ oluştu galiba, seninle iş yapmak keyifli.`,
  6: (name) => `${name}: Artık gerçek anlamda arkadaş sayılırız, değil mi?`,
  10: (name) => `${name}: Sana en iyi fırsatları ilk sen görüyorsun artık, hep böyle kalsın.`,
};

export function friendBondMilestoneLine(friendName: string, milestone: number): string | null {
  return milestoneLines[milestone]?.(friendName) ?? null;
}
