export type Difficulty = "kolay" | "normal" | "zor";

const KEY = "simsar-emlak-difficulty";

/** "normal" = 1x is the exact suspicion-gain math the game always used — picking a
 * difficulty only ever scales relative to that, so an untouched setting changes nothing. */
export const difficultyMultiplier: Record<Difficulty, number> = {
  kolay: 0.8,
  normal: 1,
  zor: 1.25,
};

export const difficultyLabels: Record<Difficulty, string> = {
  kolay: "Kolay",
  normal: "Normal",
  zor: "Zor",
};

export function getDifficulty(): Difficulty {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "kolay" || v === "normal" || v === "zor") return v;
  } catch {
    // ignore
  }
  return "normal";
}

export function setDifficulty(d: Difficulty): void {
  try {
    localStorage.setItem(KEY, d);
  } catch {
    // ignore
  }
}
