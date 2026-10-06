import type { ContractClause } from "../types";

const teslimOptions = [
  { id: "hemen", label: { tr: "Hemen (1 hafta içinde)", en: "Immediately (within 1 week)" }, short: { tr: "Hemen", en: "Now" } },
  { id: "bir-ay", label: { tr: "1 ay sonra", en: "After 1 month" }, short: { tr: "1 ay", en: "1 month" } },
  { id: "uc-ay", label: { tr: "3 ay sonra", en: "After 3 months" }, short: { tr: "3 ay", en: "3 months" } },
];

const depozitoOptions = [
  { id: "yuzde5", label: { tr: "%5 depozito", en: "5% deposit" }, short: { tr: "%5", en: "5%" } },
  { id: "yuzde10", label: { tr: "%10 depozito", en: "10% deposit" }, short: { tr: "%10", en: "10%" } },
  { id: "yuzde15", label: { tr: "%15 depozito", en: "15% deposit" }, short: { tr: "%15", en: "15%" } },
];

const tadilatOptions = [
  { id: "alici", label: { tr: "Tadilat masrafı alıcıya ait", en: "Renovation cost borne by buyer" }, short: { tr: "Alıcı", en: "Buyer" } },
  { id: "satici", label: { tr: "Tadilat masrafı satıcıya ait", en: "Renovation cost borne by seller" }, short: { tr: "Satıcı", en: "Seller" } },
  { id: "yari", label: { tr: "Masraf yarı yarıya paylaşılır", en: "Costs shared 50/50" }, short: { tr: "Yarı yarıya", en: "50/50" } },
];

/** Generates a fresh contract with a randomly hidden customer preference per clause. */
export function generateContract(): ContractClause[] {
  const pick = <T extends { id: string }>(options: T[]) => options[Math.floor(Math.random() * options.length)].id;
  return [
    {
      id: "teslim",
      title: { tr: "Teslim Tarihi", en: "Delivery Date" },
      options: teslimOptions,
      preferredOptionId: pick(teslimOptions),
    },
    {
      id: "depozito",
      title: { tr: "Depozito", en: "Deposit" },
      options: depozitoOptions,
      preferredOptionId: pick(depozitoOptions),
    },
    {
      id: "tadilat",
      title: { tr: "Tadilat Sorumluluğu", en: "Renovation Responsibility" },
      options: tadilatOptions,
      preferredOptionId: pick(tadilatOptions),
    },
  ];
}

/**
 * Blind pick (round 1) + up to 2 more counter-offer rounds where the
 * customer reveals their real preference on whatever's still mismatched
 * and Emlah can concede or hold firm — 3 rounds total, hard cap.
 */
export const MAX_CONTRACT_ROUNDS = 3;

/** Small, fixed cost per extra round beyond the first — negotiating harder
 *  to reach the same deal chips a little off the commission bonus, so
 *  reaching a full match on round 1 always beats reaching it on round 3. */
export const CONTRACT_ROUND_PENALTY = 0.015;

export interface ContractOutcome {
  matches: number;
  total: number;
  modifier: number;
  roundsUsed: number;
}

function baseModifier(matches: number, total: number): number {
  if (matches === total) return 0.05;
  if (matches === 0) return -0.05;
  return 0;
}

export function evaluateContract(clauses: ContractClause[], selections: Record<string, string>, roundsUsed = 1): ContractOutcome {
  const total = clauses.length;
  const matches = clauses.filter((c) => selections[c.id] === c.preferredOptionId).length;
  const extraRounds = Math.max(0, roundsUsed - 1);
  const modifier = baseModifier(matches, total) - extraRounds * CONTRACT_ROUND_PENALTY;
  return { matches, total, modifier, roundsUsed };
}
