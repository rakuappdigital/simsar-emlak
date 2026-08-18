/**
 * "Yankı Ağı" — a past customer's name occasionally surfaces in a totally
 * unrelated house visit, making the world feel like word-of-mouth is
 * spreading. Reuses the already-tracked ContactedCustomer list (no new
 * state), and is pure flavor — same prepended-lines mechanism as
 * celebrities.ts/renovation.ts warnings, zero stat effect.
 */
import type { ContactedCustomer, DialogueLine } from "../types";

export const ECHO_CHANCE = 0.12;

const templates = [
  "{isim} sizi öyle anlattı ki, tanışmak için sabırsızlanıyordum.",
  "Bir arkadaşım sizi anlattı — {isim} demiş ki çok tatlı biriymişsiniz.",
  "Duydum ki {isim} de sizden bir ev almış, çok memnun kalmışlar.",
  "{isim} bu konuda size güvenilir biri olduğunuzu söylemişti.",
];

export function pickEchoLines(pastContacts: ContactedCustomer[]): DialogueLine[] | null {
  if (pastContacts.length === 0) return null;
  const contact = pastContacts[Math.floor(Math.random() * pastContacts.length)];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const text = template.replace("{isim}", contact.name);
  return [
    { speaker: "customer1", text },
    { speaker: "thought", text: "(içinden) Küçük bir dünya galiba." },
  ];
}
