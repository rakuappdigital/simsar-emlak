import type { GameStats, SceneOutcome, MemoryKind, SignificantMemory } from "../types";

/**
 * "Karar Anıları" — the mirror image of echoNetwork.ts: instead of a past
 * CUSTOMER'S name surfacing, one of Emlah's own defining moments gets
 * referenced by a totally unrelated customer much later. Classified purely
 * from data finalizeResult already computes (outcome + finalStats), no new
 * authoring. Capped store (oldest drops first) and a minimum-age gate so a
 * memory can't be referenced the same week it happened.
 */
export const MAX_STORED_MEMORIES = 5;
export const MEMORY_MIN_HOUSES_DELAY = 5;
export const MEMORY_REFERENCE_CHANCE = 0.1;

const KURNAZ_SUSPICION_THRESHOLD = 55;
const DURUST_SUSPICION_THRESHOLD = 10;
const KAYIP_INTEREST_THRESHOLD = 60;
const KAYIP_FUN_THRESHOLD = 40;

/** Called once per main-house resolution in finalizeResult — returns a new memory to store, or null. */
export function maybeRecordMemory(
  outcome: SceneOutcome,
  stats: GameStats,
  houseId: string,
  houseTitle: string,
  currentIndex: number,
): SignificantMemory | null {
  if (outcome === "sold" && stats.suspicion >= KURNAZ_SUSPICION_THRESHOLD) {
    return { id: `${houseId}-kurnaz`, kind: "kurnaz-satis", houseTitle, recordedAtIndex: currentIndex };
  }
  if (outcome === "sold" && stats.suspicion <= DURUST_SUSPICION_THRESHOLD) {
    return { id: `${houseId}-durust`, kind: "durust-satis", houseTitle, recordedAtIndex: currentIndex };
  }
  if (outcome === "lost" && stats.interest >= KAYIP_INTEREST_THRESHOLD && stats.fun >= KAYIP_FUN_THRESHOLD) {
    return { id: `${houseId}-kayip`, kind: "buyuk-kayip", houseTitle, recordedAtIndex: currentIndex };
  }
  return null;
}

/** Keeps the store capped, dropping the oldest entry first. */
export function pushMemory(store: SignificantMemory[], memory: SignificantMemory): SignificantMemory[] {
  const next = [...store, memory];
  return next.length > MAX_STORED_MEMORIES ? next.slice(next.length - MAX_STORED_MEMORIES) : next;
}

/** The oldest memory old enough to be referenced, or null if none qualify yet. */
export function pickEligibleMemory(store: SignificantMemory[], currentIndex: number): SignificantMemory | null {
  const eligible = store.filter((m) => currentIndex - m.recordedAtIndex >= MEMORY_MIN_HOUSES_DELAY);
  if (eligible.length === 0) return null;
  return eligible.reduce((oldest, m) => (m.recordedAtIndex < oldest.recordedAtIndex ? m : oldest));
}

const referenceLines: Record<MemoryKind, string[]> = {
  "kurnaz-satis": [
    "Bir arkadaşım anlattı, \"{ev}\" için epey kurnaz bir yöntem kullanmışsınız.",
    "\"{ev}\" hikayenizi duydum, cesur bir pazarlıkmış doğrusu.",
  ],
  "durust-satis": [
    "\"{ev}\" konusunda ne kadar dürüst davrandığınızı anlatmışlar bana.",
    "Sizi \"{ev}\" satışındaki dürüstlüğünüzle tanıyorum, öyle duydum.",
  ],
  "buyuk-kayip": [
    "\"{ev}\" elinizden kaçmış diye duydum, gerçekten üzülmüş olmalısınız.",
    "\"{ev}\" konusunda ne kadar uğraştığınızı ama olmadığını duymuştum.",
  ],
};

export function pickMemoryReferenceLine(memory: SignificantMemory): string {
  const pool = referenceLines[memory.kind];
  const template = pool[Math.floor(Math.random() * pool.length)];
  return template.replace("{ev}", memory.houseTitle);
}
