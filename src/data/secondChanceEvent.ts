import type { HouseResult } from "../types";
import { resolveText, type Localized } from "./language";

/**
 * "İkinci Şans" — a surprise, unprompted version of the existing manual
 * "Tekrar Dene" flow (see retryFromInbox in App.tsx). Rather than the
 * player having to dig through the inbox for an old lost sale, a past
 * customer occasionally reaches out on their own. Fires at most once per
 * game (secondChanceOffered), only drops a message into that house's
 * existing inbox thread — the actual retry (negotiationChoices,
 * resolveOutcome) is entirely the pre-existing, already-tested pipeline.
 */
export const SECOND_CHANCE_CHANCE = 0.12;
export const SECOND_CHANCE_MIN_INDEX = 8;

export function pickSecondChanceCandidateIndex(results: HouseResult[]): number | null {
  const eligible = results
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => r.outcome === "lost" && !r.retriedLost);
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)].i;
}

const secondChanceLines: Localized[] = [
  { tr: "Merhaba, geçen görüşmemizi düşünüp duruyorum. Belki yanlış karar verdim.", en: "Hello, I keep thinking about our last meeting. Maybe I made the wrong decision." },
  { tr: "Rahatsız ediyorsam kusura bakmayın ama aklımdan çıkmadınız, tekrar konuşabilir miyiz?", en: "Sorry if I am disturbing you, but you haven't left my mind, can we talk again?" },
  { tr: "O evi başkası aldı mı bilmiyorum ama hâlâ ilgileniyor olabilirim, bir şansımız daha olsun.", en: "I don't know if someone else bought that house, but I might still be interested, let's have another chance." },
  { tr: "Ailemle tekrar konuştuk, belki de acele karar vermiştik.", en: "We talked with my family again, maybe we made a hasty decision." },
];

export function pickSecondChanceLine(): string {
  return resolveText(secondChanceLines[Math.floor(Math.random() * secondChanceLines.length)]);
}
