export type Speaker = "emlah" | "thought" | "customer1" | "customer2" | "system";

export interface DialogueLine {
  speaker: Speaker;
  name?: string;
  text: string;
}

export interface ChoiceEffects {
  suspicion?: number;
  interest?: number;
  fun?: number;
  /** Negotiated discount, as a percentage of asking price (positive = price drops). */
  discountPercent?: number;
  /**
   * Only present on final "kapanış" choices. Nudges the computed outcome
   * (see resolveOutcome) toward sold (positive) or lost (negative) instead
   * of the choice deterministically picking the ending.
   */
  closingBias?: number;
}

export interface Choice {
  id: string;
  text: string;
  next: string;
  effects?: ChoiceEffects;
}

export interface DialogueNode {
  id: string;
  lines: DialogueLine[];
  choices?: Choice[];
  next?: string;
  end?: "sold" | "thinking" | "lost";
}

/** How strongly this particular customer reacts to each stat when the outcome is resolved. */
export interface CustomerProfile {
  suspicionWeight: number;
  funWeight: number;
  interestWeight: number;
}

export interface HouseScene {
  id: string;
  title: string;
  location: string;
  customerNames: string[];
  background: string;
  /** Asking price in TL, shown to the player before negotiation. */
  askingPrice: number;
  /** Node ids to jump to once the final outcome is computed from stats. */
  closingNodes: { sold: string; thinking: string; lost: string };
  /** Optional per-customer personality weighting; falls back to DEFAULT_PROFILE. */
  profile?: CustomerProfile;
  /** Portfolio tier — tier 2/3 houses stay out of rotation until unlocked in the market. */
  tier: 1 | 2 | 3;
  startNode: string;
  nodes: Record<string, DialogueNode>;
}

export interface PhoneMessage {
  from: string;
  text: string;
}

export type GameStats = {
  suspicion: number;
  interest: number;
  fun: number;
  discountPercent: number;
};

export type SceneOutcome = "sold" | "thinking" | "lost";

export interface SaleResult {
  finalPrice: number;
  commission: number;
  discountPercent: number;
  streakBonus: number;
  /** From the post-sale contract signing (-0.05..+0.05 typically). */
  contractModifier: number;
  /** Passive bonus from Emlah's career rank at the time of this sale. */
  rankBonus: number;
}

export interface HouseResult {
  houseId: string;
  outcome: SceneOutcome;
  sale: SaleResult | null;
  /** Full stats snapshot at the moment this house's outcome resolved. */
  finalStats: GameStats;
  /** Suspicion value accumulated by the time this house's outcome resolved. */
  finalSuspicion: number;
  /** Set to true if this "thinking" result later converted into a sale via a callback. */
  converted?: boolean;
}

export interface WeekGoal {
  weekIndex: number;
  salesTarget: number;
  maxAvgSuspicion: number;
}

export interface WeekOutcome {
  weekIndex: number;
  salesTarget: number;
  salesMade: number;
  maxAvgSuspicion: number;
  avgSuspicion: number;
  salesGoalMet: boolean;
  honestyGoalMet: boolean;
  bonus: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
}

export type MarketCategory = "ofis" | "kiyafet" | "sertifika" | "arac" | "kilit" | "sarf";

export interface Perk {
  id: string;
  category: MarketCategory;
  title: string;
  description: string;
  cost: number;
  /** True for single-use items that go into the consumables inventory instead of ownedPerks. */
  consumable?: boolean;
  /** id of another market item that must already be owned before this one can be bought. */
  requires?: string;
  /** Set on "kilit" items — buying it adds this tier to unlockedTiers. */
  unlocksTier?: 2 | 3;
}

export interface SaveGame {
  version: 3;
  index: number;
  houseOrder: number[];
  results: HouseResult[];
  weekOutcomes: WeekOutcome[];
  badges: string[];
  ownedPerks: string[];
  consumables: Record<string, number>;
  unlockedTiers: number[];
  spent: number;
  savedAt: string;
}

export interface ContractClauseOption {
  id: string;
  label: string;
}

export interface ContractClause {
  id: string;
  title: string;
  options: ContractClauseOption[];
  /** id of the option this particular customer secretly prefers. */
  preferredOptionId: string;
}
