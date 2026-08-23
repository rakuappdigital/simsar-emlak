import type { SaveGame } from "../types";

const SAVE_VERSION = 23;
export const SAVE_SLOT_COUNT = 3;

const keyFor = (slot: number) => `simsar-emlak-save-v${SAVE_VERSION}-slot${slot}`;

export function loadSave(slot: number): SaveGame | null {
  try {
    const raw = localStorage.getItem(keyFor(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveGame;
    if (parsed.version !== SAVE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadAllSaves(): (SaveGame | null)[] {
  return Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => loadSave(i));
}

export function writeSave(save: SaveGame, slot: number): void {
  try {
    localStorage.setItem(keyFor(slot), JSON.stringify(save));
  } catch {
    // storage unavailable (private mode etc) — silently skip, gameplay still works
  }
}

export function clearSave(slot: number): void {
  try {
    localStorage.removeItem(keyFor(slot));
  } catch {
    // ignore
  }
}

/** First slot with no save, or slot 0 if every slot is occupied (oldest gets overwritten). */
export function firstAvailableSlot(): number {
  for (let i = 0; i < SAVE_SLOT_COUNT; i++) {
    if (!loadSave(i)) return i;
  }
  return 0;
}
