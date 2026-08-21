/**
 * "Emlah'ın İç Sesi" — a small passive skill tree, paid for with Deneyim
 * Puanı (XP earned from house results, not money) instead of the market's
 * TL economy. Two short branches, three tiers each, gated behind the
 * previous tier in the same branch. Effects are purely additive nudges
 * applied exactly like reputationSuspicionOffset/districtReputationOffset
 * already are in enterPhone(), and skillSuspicionFactor (scoring.ts) is
 * one more multiplicand in the same chain as suspicionGainFactor — nothing
 * here touches resolveOutcome's actual formula.
 */
export type SkillBranch = "sakin-kafa" | "karizma";

export interface SkillNode {
  id: string;
  branch: SkillBranch;
  tier: 1 | 2 | 3;
  title: string;
  description: string;
  cost: number;
  requires?: string;
  /** Applied multiplicatively alongside suspicionGainFactor — see scoring.ts's skillSuspicionFactor. */
  suspicionFactor?: number;
  /** Flat starting-stat nudges, applied once per house alongside the existing prestige bonus. */
  startingFun?: number;
  startingInterest?: number;
}

export const skillTree: SkillNode[] = [
  {
    id: "sakin-kafa-1",
    branch: "sakin-kafa",
    tier: 1,
    title: "Soğukkanlılık",
    description: "Zor sorular karşısında sakin kalmayı öğrendin. Şüphe artışı %5 daha yavaş.",
    cost: 15,
    suspicionFactor: 0.95,
  },
  {
    id: "sakin-kafa-2",
    branch: "sakin-kafa",
    tier: 2,
    title: "Empati",
    description: "Karşındakini gerçekten dinliyorsun. Şüphe artışı bir %7 daha yavaş.",
    cost: 30,
    requires: "sakin-kafa-1",
    suspicionFactor: 0.93,
  },
  {
    id: "sakin-kafa-3",
    branch: "sakin-kafa",
    tier: 3,
    title: "Usta Diplomat",
    description: "Artık hiçbir şey seni telaşlandırmıyor. Şüphe artışı bir %10 daha yavaş.",
    cost: 50,
    requires: "sakin-kafa-2",
    suspicionFactor: 0.9,
  },
  {
    id: "karizma-1",
    branch: "karizma",
    tier: 1,
    title: "İlk İzlenim",
    description: "Kapıdan girer girmez fark yaratıyorsun. Her evde +3 eğlence, +2 ilgi ile başlarsın.",
    cost: 15,
    startingFun: 3,
    startingInterest: 2,
  },
  {
    id: "karizma-2",
    branch: "karizma",
    tier: 2,
    title: "Sohbet Ustası",
    description: "Havadan sudan konuşman bile ikna edici. Her evde +5 eğlence, +3 ilgi ile başlarsın.",
    cost: 30,
    requires: "karizma-1",
    startingFun: 5,
    startingInterest: 3,
  },
  {
    id: "karizma-3",
    branch: "karizma",
    tier: 3,
    title: "Karizmatik Kapanış",
    description: "Odaya girdiğin an satış yarı yarıya bitmiş oluyor. Her evde +8 eğlence, +5 ilgi ile başlarsın.",
    cost: 50,
    requires: "karizma-2",
    startingFun: 8,
    startingInterest: 5,
  },
];

export function skillById(id: string): SkillNode | undefined {
  return skillTree.find((s) => s.id === id);
}

export function canUnlockSkill(skill: SkillNode, ownedSkillIds: string[], availableXP: number): boolean {
  if (ownedSkillIds.includes(skill.id)) return false;
  if (availableXP < skill.cost) return false;
  if (skill.requires && !ownedSkillIds.includes(skill.requires)) return false;
  return true;
}

/** +1 XP for a "thinking"/"lost" visit, +3 for a "sold" one — a small trickle regardless of outcome so the tree always feels reachable. */
export function xpForOutcome(outcome: "sold" | "thinking" | "lost"): number {
  return outcome === "sold" ? 3 : 1;
}

export function startingBonusForSkills(ownedSkillIds: string[]): { fun: number; interest: number } {
  let fun = 0;
  let interest = 0;
  for (const id of ownedSkillIds) {
    const skill = skillById(id);
    if (!skill) continue;
    fun += skill.startingFun ?? 0;
    interest += skill.startingInterest ?? 0;
  }
  return { fun, interest };
}
