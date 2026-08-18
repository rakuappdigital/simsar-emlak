/**
 * "Sen gerçekten çok tıklıyorsun ha" — a silent, lifetime click counter
 * across every playthrough (own localStorage key, like prestige.ts). Counts
 * every click anywhere in the app, no gameplay meaning at all — purely a
 * "the game noticed" surprise at absurd round numbers.
 */
const STORAGE_KEY = "simsar-emlak-clicks";
const MILESTONES = [1000, 5000, 10000, 25000, 50000, 100000];

interface ClickData {
  count: number;
  seenMilestones: number[];
}

function load(): ClickData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, seenMilestones: [] };
    const parsed = JSON.parse(raw);
    return {
      count: typeof parsed.count === "number" ? parsed.count : 0,
      seenMilestones: Array.isArray(parsed.seenMilestones) ? parsed.seenMilestones : [],
    };
  } catch {
    return { count: 0, seenMilestones: [] };
  }
}

function save(data: ClickData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — the counter just won't persist, no gameplay impact
  }
}

/** Call on every click. Returns a newly-crossed milestone, or null. */
export function recordClick(): number | null {
  const data = load();
  data.count += 1;
  const crossed = MILESTONES.find((m) => data.count >= m && !data.seenMilestones.includes(m));
  if (crossed !== undefined) data.seenMilestones = [...data.seenMilestones, crossed];
  save(data);
  return crossed ?? null;
}

export function milestoneMessage(milestone: number): string {
  return `Sen gerçekten çok tıklıyorsun ha — bu senin ${milestone.toLocaleString("tr-TR")}. tıklaman!`;
}
