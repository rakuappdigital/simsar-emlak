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
}

export interface HouseResult {
  houseId: string;
  outcome: SceneOutcome;
  sale: SaleResult | null;
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

export interface SaveGame {
  version: 1;
  index: number;
  results: HouseResult[];
  weekOutcomes: WeekOutcome[];
  badges: string[];
  savedAt: string;
}
