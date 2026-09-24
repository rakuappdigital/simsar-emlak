/**
 * "Yankı Ağı" — a past customer's name occasionally surfaces in a totally
 * unrelated house visit, making the world feel like word-of-mouth is
 * spreading. Reuses the already-tracked ContactedCustomer list (no new
 * state), and is pure flavor — same prepended-lines mechanism as
 * celebrities.ts/renovation.ts warnings, zero stat effect.
 */
import type { ContactedCustomer, DialogueLine } from "../types";
import { resolveText, type Localized } from "./language";

export const ECHO_CHANCE = 0.12;

const templates: Localized[] = [
  { tr: "{isim} sizi öyle anlattı ki, tanışmak için sabırsızlanıyordum.", en: "{isim} described you in such a way that I was impatient to meet." },
  { tr: "Bir arkadaşım sizi anlattı — {isim} demiş ki çok tatlı biriymişsiniz.", en: "A friend told me about you — {isim} said you were a very sweet person." },
  { tr: "Duydum ki {isim} de sizden bir ev almış, çok memnun kalmışlar.", en: "I heard that {isim} also bought a house from you, they were very pleased." },
  { tr: "{isim} bu konuda size güvenilir biri olduğunuzu söylemişti.", en: "{isim} told you that you are a reliable person in this matter." },
];

export function pickEchoLines(pastContacts: ContactedCustomer[]): DialogueLine[] | null {
  if (pastContacts.length === 0) return null;
  const contact = pastContacts[Math.floor(Math.random() * pastContacts.length)];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const text = resolveText(template).replace("{isim}", contact.name);
  return [
    { speaker: "customer1", text },
    { speaker: "thought", text: resolveText({ tr: "(içinden) Küçük bir dünya galiba.", en: "(to himself) Small world, I guess." }) },
  ];
}
