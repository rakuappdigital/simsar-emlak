import type { Choice } from "../types";

/**
 * "Son Dakika Baskısı" — on a rare closing node, an extra choice appears
 * that LOOKS like a shortcut to a fast, easy close (framed as decisive/
 * confident) but secretly bakes in a real suspicion cost alongside its
 * closingBias — same synthetic-Choice-append mechanism as bonusChoice/
 * flirtChoice in DialogueScene.tsx, not a new resolution path. Rewards a
 * patient player who reads it as too-good-to-be-true and picks a real
 * choice instead.
 */
export const LAST_MINUTE_PRESSURE_CHANCE = 0.1;

const pressureChoices: Choice[] = [
  {
    id: "son-dakika-1",
    text: "\"Tamam, hemen imzalayalım, düşünmeye gerek yok!\"",
    next: "",
    effects: { closingBias: 10, suspicion: 18 },
  },
  {
    id: "son-dakika-2",
    text: "\"Zaman kaybetmeyelim, şartları hemen kabul edelim!\"",
    next: "",
    effects: { closingBias: 10, suspicion: 18 },
  },
];

export function pickPressureChoice(): Choice {
  return pressureChoices[Math.floor(Math.random() * pressureChoices.length)];
}
