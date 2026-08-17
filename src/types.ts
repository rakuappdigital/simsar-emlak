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

export type Gender = "k" | "e";

/** A single customer slot to be filled randomly from the character pool at game start. */
export interface CastSlot {
  /** If omitted, any gender from the pool can fill this slot. */
  gender?: Gender;
}

export interface HouseScene {
  id: string;
  title: string;
  location: string;
  /**
   * Static customer names for hand-authored houses. Ignored (and can be
   * left as placeholders) when `dynamicCast` is set — those houses get
   * their customer name(s) assigned randomly from the shared character
   * pool at the start of each game instead.
   */
  customerNames: string[];
  background: string;
  /** Asking price in TL, shown to the player before negotiation. */
  askingPrice: number;
  /** Node ids to jump to once the final outcome is computed from stats. */
  closingNodes: { sold: string; thinking: string; lost: string };
  /** Optional per-customer personality weighting; falls back to DEFAULT_PROFILE. */
  profile?: CustomerProfile;
  /** Portfolio tier — tier 2/3/4 houses stay out of rotation until unlocked in the market. */
  tier: 1 | 2 | 3 | 4 | 5;
  /** One entry per customer slot (customer1, customer2, ...) — enables random cast assignment. */
  dynamicCast?: CastSlot[];
  startNode: string;
  nodes: Record<string, DialogueNode>;
}

/** A reusable customer identity — name + portrait — not tied to any single house. */
export interface PoolCharacter {
  id: string;
  gender: Gender;
  name: string;
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
  /** True once the player has used their one manual "Tekrar Dene" attempt from the inbox on a lost sale. */
  retriedLost?: boolean;
  /** Text of the highest-fun choice picked during this house's dialogue, if any. */
  bestLine?: string;
  /** The `fun` value of `bestLine`, kept alongside it to compare across houses when picking a week's best. */
  bestLineFun?: number;
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
  /** Text of the week's single highest-fun dialogue choice, if any house had one. */
  bestLine?: string;
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
  unlocksTier?: 2 | 3 | 4 | 5;
  /** Extra unlock conditions beyond cost, only meaningful for "kilit" items with unlocksTier set — see effectiveCost/MarketPanel. */
  requiresSoldCount?: number;
  requiresOfisItemCount?: number;
  /** Set on "kiyafet" items — contributes to the shared Prestij bar instead of a bespoke stat effect. */
  prestige?: number;
  /** Set on energy-drink "sarf" items — buying instantly refills the energy bar by this much instead of going into the consumables inventory. */
  energyFill?: number;
}

export interface InboxMessage {
  id: string;
  /** "muzaffer" for the boss thread, otherwise a houseId — one thread per customer. */
  threadId: string;
  contactName: string;
  text: string;
  fromPlayer?: boolean;
  /** 1-based house position this message is associated with, for chronological ordering/flavor. */
  day: number;
}

export interface DailyQuestDef {
  id: "discount-free" | "low-suspicion" | "streak-2" | "high-fun";
  title: string;
  description: string;
  reward: number;
}

/** An active loan to Bora, waiting to (maybe) be repaid at houseIndex >= dueIndex. */
export interface PendingLoan {
  dueIndex: number;
  amount: number;
}

/** A property Emlah bought with his own money via the "bora-yatirim" chitchat — resolves for a profit or a loss a few weeks later. */
export interface PendingInvestment {
  dueIndex: number;
}

/** A flip-property from the investmentHouses pool that Emlah currently owns and hasn't resold yet. */
export interface OwnedInvestmentHouse {
  houseId: string;
  purchasePrice: number;
  /** Rolled once at purchase time — see data/renovation.ts. */
  condition: "iyi" | "orta" | "kotu";
  /** "yok" until the player pays for one of the three renovation levels. */
  renovationLevel: "yok" | "basit" | "orta" | "yenileme";
}

/** A past customer (from a main, premium, or investment-house sale) Emlah can message again to pitch a flip property. */
export interface ContactedCustomer {
  characterId: string;
  name: string;
  houseTitle: string;
}

/** The deferred-payment portion of a sale whose contract set a "1 ay sonra"/"3 ay sonra" delivery term — see data/calendar.ts. */
export interface PendingDelivery {
  id: string;
  houseTitle: string;
  /** Pre-formatted at creation time so the save doesn't need to store/reserialize a Date. */
  deliveryDateLabel: string;
  dueIndex: number;
  deferredAmount: number;
}

export interface SaveGame {
  version: 13;
  index: number;
  houseOrder: number[];
  results: HouseResult[];
  weekOutcomes: WeekOutcome[];
  badges: string[];
  ownedPerks: string[];
  consumables: Record<string, number>;
  unlockedTiers: number[];
  spent: number;
  inbox: InboxMessage[];
  /** houseId -> assigned pool character ids, in customer1/customer2 order. */
  castAssignment: Record<string, string[]>;
  /** This week's rotating bonus objective, or null between weeks. */
  dailyQuest: DailyQuestDef | null;
  /** One-off income outside the sale/week-bonus flow (loan repayments, etc.). */
  bonusEarnings: number;
  /** A loan currently out to Bora, or null if none active. */
  pendingLoan: PendingLoan | null;
  /** Lifetime counters that badges and the career stats panel read from. */
  tasksCompleted: number;
  chitchatBonuses: number;
  /** One-off "Özel Davet" bonus house results — never touches `results`/`houseOrder` indices. */
  premiumResults: HouseResult[];
  /** A self-funded property currently held, or null if none active. */
  pendingInvestment: PendingInvestment | null;
  /** Pool character id -> bond points from flirty moments and meetups — entirely optional, never required to progress. */
  friendBonds: Record<string, number>;
  /** Flip-properties currently owned but not yet resold. */
  ownedInvestmentHouses: OwnedInvestmentHouse[];
  /** Every resolved investment-house sale attempt (sold/thinking/lost) — separate from `results`, never touches week grouping. */
  investmentResults: HouseResult[];
  /** Past customers Emlah can message again to pitch a flip property. */
  contactedCustomers: ContactedCustomer[];
  /** id of the currently active marketNews headline (see data/marketNews.ts), or null if none active. */
  activeNewsId: string | null;
  /** Emlah'ın Enerjisi — 0-100, see data/energy.ts. */
  energy: number;
  /** Deferred sale payments waiting on their contract's delivery date — see data/calendar.ts. */
  pendingDeliveries: PendingDelivery[];
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
