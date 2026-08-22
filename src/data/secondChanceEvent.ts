import type { HouseResult } from "../types";

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

const secondChanceLines = [
  "Merhaba, geçen görüşmemizi düşünüp duruyorum. Belki yanlış karar verdim.",
  "Rahatsız ediyorsam kusura bakmayın ama aklımdan çıkmadınız, tekrar konuşabilir miyiz?",
  "O evi başkası aldı mı bilmiyorum ama hâlâ ilgileniyor olabilirim, bir şansımız daha olsun.",
  "Ailemle tekrar konuştuk, belki de acele karar vermiştik.",
];

export function pickSecondChanceLine(): string {
  return secondChanceLines[Math.floor(Math.random() * secondChanceLines.length)];
}
