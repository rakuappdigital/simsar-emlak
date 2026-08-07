import type { ContractClause } from "../types";

const teslimOptions = [
  { id: "hemen", label: "Hemen (1 hafta içinde)" },
  { id: "bir-ay", label: "1 ay sonra" },
  { id: "uc-ay", label: "3 ay sonra" },
];

const depozitoOptions = [
  { id: "yuzde5", label: "%5 depozito" },
  { id: "yuzde10", label: "%10 depozito" },
  { id: "yuzde15", label: "%15 depozito" },
];

const tadilatOptions = [
  { id: "alici", label: "Tadilat masrafı alıcıya ait" },
  { id: "satici", label: "Tadilat masrafı satıcıya ait" },
  { id: "yari", label: "Masraf yarı yarıya paylaşılır" },
];

/** Generates a fresh contract with a randomly hidden customer preference per clause. */
export function generateContract(): ContractClause[] {
  const pick = <T extends { id: string }>(options: T[]) => options[Math.floor(Math.random() * options.length)].id;
  return [
    { id: "teslim", title: "Teslim Tarihi", options: teslimOptions, preferredOptionId: pick(teslimOptions) },
    { id: "depozito", title: "Depozito", options: depozitoOptions, preferredOptionId: pick(depozitoOptions) },
    { id: "tadilat", title: "Tadilat Sorumluluğu", options: tadilatOptions, preferredOptionId: pick(tadilatOptions) },
  ];
}

export interface ContractOutcome {
  matches: number;
  total: number;
  modifier: number; // fraction applied to commission, e.g. 0.05 / -0.05
}

export function evaluateContract(clauses: ContractClause[], selections: Record<string, string>): ContractOutcome {
  const total = clauses.length;
  const matches = clauses.filter((c) => selections[c.id] === c.preferredOptionId).length;
  let modifier = 0;
  if (matches === total) modifier = 0.05;
  else if (matches === 0) modifier = -0.05;
  return { matches, total, modifier };
}
