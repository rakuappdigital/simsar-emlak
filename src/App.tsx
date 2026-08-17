import { useEffect, useRef, useState, type MouseEvent } from "react";
import PhoneScreen from "./components/PhoneScreen";
import OfficeScene from "./components/OfficeScene";
import DialogueScene from "./components/DialogueScene";
import StatsBar from "./components/StatsBar";
import MainMenu from "./components/MainMenu";
import SavedGames from "./components/SavedGames";
import SettingsScreen from "./components/SettingsScreen";
import WeekResult from "./components/WeekResult";
import ContractModal from "./components/ContractModal";
import EmlahMenu, { type EmlahTab } from "./components/EmlahMenu";
import { WalletIcon, StarIcon, MedalIcon } from "./components/icons";
import { playClick, playSale, playLost, playReward, playThinking } from "./data/sound";
import { houseIntros, defaultIntro } from "./data/intro";
import { pickChitchat, type ChitchatSet } from "./data/chitchat";
import { pickFriendMessage, type FriendMessageSet } from "./data/friendFlavor";
import WorkTaskScreen from "./components/WorkTaskScreen";
import { pickWorkTask, type WorkTaskDef } from "./data/workTasks";
import { pickQuickCall } from "./data/quickCall";
import QuickCallScreen from "./components/QuickCallScreen";
import { pickIntroFlavor, reputationLabel, reputationSuspicionOffset, districtOf, districtReputationOffset } from "./data/introFlavor";
import { generateShareCard } from "./data/shareCard";
import { getDifficulty, difficultyMultiplier } from "./data/difficulty";
import { loadHouseImage } from "./data/houseImages";
import { logMessages, housesSinceLastCallback, pruneInbox } from "./data/inbox";
import { assignCast, resolveCustomerNames, resolvePortrait, poolCharacterById } from "./data/characterPool";
import { injectCelebrities } from "./data/celebrities";
import { countOwnedOfisItems } from "./data/officeImages";
import { RIVAL_DUEL_CHANCE, RIVAL_DUEL_BONUS_RATE, pickDuelStartMessage, pickDuelWinMessage, pickDuelLoseMessage } from "./data/rivalDuel";
import {
  MYSTERY_SHOPPER_CHANCE,
  MYSTERY_SHOPPER_HONEST_BONUS,
  MYSTERY_SHOPPER_SNEAKY_PENALTY,
  mysteryShopperVerdict,
  pickMysteryShopperReveal,
} from "./data/mysteryShopper";
import { generateSocialReaction, type SocialReaction } from "./data/socialReaction";
import {
  type RenovationLevel,
  rollCondition,
  renovationGap,
  renovationCost,
  renovationPriceBoost,
  RENOVATION_GAP_TOUGHNESS,
} from "./data/renovation";
import { ENERGY_MAX, ENERGY_DEPLETION_PER_HOUSE, ENERGY_LOW_THRESHOLD, ENERGY_LOW_SUSPICION_MULTIPLIER, WEEKLY_ENERGY_REGEN } from "./data/energy";
import {
  type DeliveryTermId,
  gameDateForIndex,
  formatGameDate,
  deliveryDateForIndex,
  dueIndexForDelivery,
  splitDeliveryPayment,
} from "./data/calendar";
import {
  FLIRT_BOND_GAIN,
  MEETUP_BOND_THRESHOLD,
  MEETUP_INVITE_CHANCE,
  meetupActivities,
  declineReplies,
  pickInvitePrompt,
} from "./data/meetup";
import { characterImages } from "./data/characterImages";
import { allHouses } from "./data/houses";
import { premiumHouses, unlockedPremiumHouseIds, ranksUnlockNewPremium } from "./data/premiumHouses";
import PremiumHouseScene from "./components/PremiumHouseScene";
import { investmentHouses, isInvestmentUnlocked } from "./data/investmentHouses";
import { marketNews, pickMarketNews } from "./data/marketNews";
import { pickTipsterMessage } from "./data/tipsters";
import NewsBanner from "./components/NewsBanner";
import { COMMISSION_RATE, formatTL } from "./data/economy";
import {
  resolveOutcome,
  streakMultiplier,
  suspicionGainFactor,
  closingBiasMultiplier,
  rankBonus,
  rankTitle,
  computeFreshStats,
} from "./data/scoring";
import { computeStreak, checkNewBadges, checkNewInvestmentBadges, allBadges } from "./data/badges";
import { HOUSES_PER_WEEK, isLastHouseOfWeek, weekIndexForHouse, evaluateWeek } from "./data/goals";
import { maybeGenerateCallback, negotiationChoices, luxuryNegotiationChoices, pickNegotiationReply, type CallbackEvent } from "./data/callbacks";
import { loadAllSaves, writeSave, clearSave, firstAvailableSlot } from "./data/save";
import { pickDailyQuest, checkDailyQuest, applyRecoveryBonus } from "./data/dailyQuest";
import { generateContract } from "./data/contract";
import { perks, hasPerk, effectiveCost } from "./data/perks";
import { tieredShuffle } from "./data/shuffle";
import { computeEnding } from "./data/endings";
import type {
  Badge,
  ChoiceEffects,
  ContactedCustomer,
  ContractClause,
  DailyQuestDef,
  GameStats,
  HouseResult,
  HouseScene,
  InboxMessage,
  OwnedInvestmentHouse,
  PendingLoan,
  PendingInvestment,
  PendingDelivery,
  PhoneMessage,
  SaleResult,
  SaveGame,
  SceneOutcome,
  WeekOutcome,
} from "./types";
import "./game.css";

type Stage =
  | "menu"
  | "saved"
  | "settings"
  | "callback"
  | "phone"
  | "chitchat"
  | "task"
  | "quickcall"
  | "house"
  | "contract"
  | "locked"
  | "result"
  | "weekGoal"
  | "summary";

const CHITCHAT_CHANCE = 0.27;
const FRIEND_CHANCE = 0.08;
const WORK_TASK_CHANCE = 0.4;
const LOAN_AMOUNT = 20000;
const LOAN_REPAY_AMOUNT = 28000;
const LOAN_REPAY_CHANCE = 0.8;
const LOAN_DUE_HOUSES = HOUSES_PER_WEEK * 2;
const INVESTMENT_COST = 150000;
const INVESTMENT_PROFIT_AMOUNT = 210000;
const INVESTMENT_LOSS_AMOUNT = 90000;
const INVESTMENT_PROFIT_CHANCE = 0.55;
const INVESTMENT_DUE_HOUSES = HOUSES_PER_WEEK * 3;
const BULK_DEAL_SAFE_AMOUNT = 70000;
const BULK_DEAL_RISKY_BIG_AMOUNT = 160000;
const BULK_DEAL_RISKY_SMALL_AMOUNT = 25000;
const BULK_DEAL_RISKY_BIG_CHANCE = 0.5;
const RANK_ORDER = ["Stajyer", "Emlakçı", "Kıdemli Emlakçı", "Ofis Ortağı"];
// Independent, non-interrupting ambient rolls — never touch `stage`, so they
// can't collide with the friend/chitchat/meetup roll chain in afterIntro().
const NEWS_CHANCE = 0.12;
const TIPSTER_CHANCE = 0.08;
/** Halves a negative news swing into extra toughness on top of the normal contract modifier when reselling a flip house. */
const NEWS_RESALE_TOUGHNESS_FACTOR = 0.5;

interface PendingHouseEntry {
  newIndex: number;
  currentResults: HouseResult[];
  perksList: string[];
  consumablesList: Record<string, number>;
  tiersList: number[];
  order: number[];
  inboxList: InboxMessage[];
  castAssignmentParam: Record<string, string[]>;
  dailyQuestParam: DailyQuestDef | null;
}

const outcomeText: Record<SceneOutcome, string> = {
  sold: "Satış tamamlandı! 🎉",
  thinking: "Müşteri düşünüyor...",
  lost: "Satış kaybedildi.",
};

export function computeSale(
  askingPrice: number,
  discountPercent: number,
  priorStreak: number,
  contractModifier: number,
  rankBonusValue: number,
): SaleResult {
  const finalPrice = askingPrice * (1 - discountPercent / 100);
  const baseCommission = finalPrice * COMMISSION_RATE;
  const streakBonus = streakMultiplier(priorStreak);
  const commission = baseCommission * (1 + streakBonus + contractModifier + rankBonusValue);
  return { finalPrice, commission, discountPercent, streakBonus, contractModifier, rankBonus: rankBonusValue };
}

/**
 * Investment-house resale — Emlah is the seller himself, so the whole
 * negotiated price becomes profit-or-loss against what he paid, not a
 * commission cut. `newsToughness` (0 when no negative news is active) is a
 * small extra drag applied only here, never touching the shared contract
 * modifier math used by main/premium/callback sales.
 */
function computeInvestmentSale(
  askingPrice: number,
  discountPercent: number,
  contractModifier: number,
  purchasePrice: number,
  toughness: number,
  renovationBoost: number,
): { finalPrice: number; profit: number } {
  const effectiveModifier = contractModifier + renovationBoost - toughness;
  const finalPrice = askingPrice * (1 - discountPercent / 100) * (1 + effectiveModifier);
  return { finalPrice, profit: finalPrice - purchasePrice };
}

/** Logs a single-customer house's assigned character as a contact Emlah can message again — dedups by characterId, no-op for two-customer houses (no single clear identity). */
function addContactedCustomer(
  house: HouseScene,
  castAssignmentParam: Record<string, string[]>,
  currentContacts: ContactedCustomer[],
): ContactedCustomer[] {
  if (!house.dynamicCast || house.dynamicCast.length !== 1) return currentContacts;
  const characterId = castAssignmentParam[house.id]?.[0];
  if (!characterId || currentContacts.some((c) => c.characterId === characterId)) return currentContacts;
  const character = poolCharacterById(characterId);
  if (!character) return currentContacts;
  return [...currentContacts, { characterId, name: character.name, houseTitle: house.title }];
}

function contactAvatar(
  name: string,
  houseId: string | undefined,
  castAssignment: Record<string, string[]>,
): string | undefined {
  const house = houseId ? allHouses.find((h) => h.id === houseId) : undefined;
  if (house) return resolvePortrait(name, house, castAssignment) ?? characterImages[name];
  return characterImages[name];
}

function consumeOneOfEach(consumables: Record<string, number>): Record<string, number> {
  const remaining = { ...consumables };
  for (const id of Object.keys(remaining)) {
    if (remaining[id] > 0) remaining[id] -= 1;
  }
  return remaining;
}

function App() {
  const [stage, setStage] = useState<Stage>("menu");
  const [index, setIndex] = useState(0);
  const [houseOrder, setHouseOrder] = useState<number[]>(() => tieredShuffle(allHouses.map((h) => h.tier)));
  const [stats, setStats] = useState<GameStats>({ suspicion: 0, interest: 0, fun: 0, discountPercent: 0 });
  const [bestLineThisHouse, setBestLineThisHouse] = useState<{ text: string; fun: number } | null>(null);
  const [results, setResults] = useState<HouseResult[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [weekOutcomes, setWeekOutcomes] = useState<WeekOutcome[]>([]);
  const [ownedPerks, setOwnedPerks] = useState<string[]>([]);
  const [consumables, setConsumables] = useState<Record<string, number>>({});
  const [unlockedTiers, setUnlockedTiers] = useState<number[]>([1]);
  const [spent, setSpent] = useState(0);
  const [pendingNewBadges, setPendingNewBadges] = useState<Badge[]>([]);
  const [pendingWeekOutcome, setPendingWeekOutcome] = useState<WeekOutcome | null>(null);
  const [activeCallback, setActiveCallback] = useState<
    (CallbackEvent & { sessionKey: string }) | null
  >(null);
  const [contractClauses, setContractClauses] = useState<ContractClause[]>([]);
  const [savedGames, setSavedGames] = useState<(SaveGame | null)[]>([null, null, null]);
  const [activeSlot, setActiveSlot] = useState(0);
  const hasSave = savedGames.some((s) => s !== null);
  const [showEmlahMenu, setShowEmlahMenu] = useState(false);
  const [emlahMenuTab, setEmlahMenuTab] = useState<EmlahTab>("market");
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [castAssignment, setCastAssignment] = useState<Record<string, string[]>>({});
  const [lastChitchatId, setLastChitchatId] = useState<string | undefined>(undefined);
  const [activeChitchat, setActiveChitchat] = useState<{
    set: ChitchatSet;
    messages: PhoneMessage[];
    showChoices: boolean;
  } | null>(null);
  const [lastFriendId, setLastFriendId] = useState<string | undefined>(undefined);
  const [activeFriendChat, setActiveFriendChat] = useState<{
    set: FriendMessageSet;
    messages: PhoneMessage[];
    showChoices: boolean;
  } | null>(null);
  const [rankUpTitle, setRankUpTitle] = useState<string | null>(null);
  const [rankUpUnlockedInvites, setRankUpUnlockedInvites] = useState(false);
  const [badgeCelebration, setBadgeCelebration] = useState<Badge[] | null>(null);
  const lastRankRef = useRef<string | null>(null);
  const [dailyQuest, setDailyQuest] = useState<DailyQuestDef | null>(null);
  const [dailyQuestResult, setDailyQuestResult] = useState<{ def: DailyQuestDef; completed: boolean } | null>(null);
  const [introFlavorMsg, setIntroFlavorMsg] = useState<PhoneMessage | null>(null);
  const [activeTask, setActiveTask] = useState<WorkTaskDef | null>(null);
  const [lastTaskId, setLastTaskId] = useState<string | undefined>(undefined);
  const [lastQuickCallId, setLastQuickCallId] = useState<string | undefined>(undefined);
  const [pendingHouseEntry, setPendingHouseEntry] = useState<PendingHouseEntry | null>(null);
  const [bonusEarnings, setBonusEarnings] = useState(0);
  const [pendingLoan, setPendingLoan] = useState<PendingLoan | null>(null);
  const [pendingInvestment, setPendingInvestment] = useState<PendingInvestment | null>(null);
  const [friendBonds, setFriendBonds] = useState<Record<string, number>>({});
  const [activeMeetup, setActiveMeetup] = useState<{
    characterId: string;
    characterName: string;
    messages: PhoneMessage[];
    showChoices: boolean;
  } | null>(null);
  const [pendingMeetupBonus, setPendingMeetupBonus] = useState<{ interest?: number; fun?: number } | null>(null);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [chitchatBonuses, setChitchatBonuses] = useState(0);
  const [premiumResults, setPremiumResults] = useState<HouseResult[]>([]);
  const [activePremiumHouseId, setActivePremiumHouseId] = useState<string | null>(null);
  const [pendingCallbackSale, setPendingCallbackSale] = useState<{
    resultIndex: number;
    targetHouse: HouseScene;
    projectedStats: GameStats;
  } | null>(null);
  const [seenInboxCount, setSeenInboxCount] = useState(0);
  const [ownedInvestmentHouses, setOwnedInvestmentHouses] = useState<OwnedInvestmentHouse[]>([]);
  const [investmentResults, setInvestmentResults] = useState<HouseResult[]>([]);
  const [contactedCustomers, setContactedCustomers] = useState<ContactedCustomer[]>([]);
  const [activeNewsId, setActiveNewsId] = useState<string | null>(null);
  const [lastTipsterId, setLastTipsterId] = useState<string | undefined>(undefined);
  const [activeInvestmentSaleId, setActiveInvestmentSaleId] = useState<string | null>(null);
  const [pitchTargetContact, setPitchTargetContact] = useState<ContactedCustomer | null>(null);
  // Four small, purely additive flavor systems — none persisted (they're
  // scoped to the single house visit they're set for and resolved by the
  // time that visit's result screen shows), so none of them touch
  // SaveGame/persist() at all.
  const [activeDuelHouseId, setActiveDuelHouseId] = useState<string | null>(null);
  const [mysteryShopperHouseId, setMysteryShopperHouseId] = useState<string | null>(null);
  const [socialReaction, setSocialReaction] = useState<SocialReaction | null>(null);
  // Emlah'ın Enerjisi — persisted (it's a real resource the player manages
  // across the whole game, unlike the four flavor systems above).
  const [energy, setEnergy] = useState(ENERGY_MAX);
  // Emlah'ın Takvimi — deferred sale payments waiting on their contract's
  // negotiated delivery date. See data/calendar.ts.
  const [pendingDeliveries, setPendingDeliveries] = useState<PendingDelivery[]>([]);
  // The "phone" stage is the hub landed on between houses/callbacks. Instead
  // of always showing the message thread immediately, it now shows the
  // office first — this flag reveals the phone/message screen on top of it
  // once the player deliberately asks for today's job. Reset below whenever
  // a fresh landing on "phone" happens, so the office is always seen first.
  const [showPhoneOverlay, setShowPhoneOverlay] = useState(false);
  useEffect(() => {
    if (stage === "phone") setShowPhoneOverlay(false);
  }, [stage]);
  const [tutorialDismissed, setTutorialDismissed] = useState(() => {
    try {
      return localStorage.getItem("simsar-emlak-tutorial-seen") === "1";
    } catch {
      return false;
    }
  });

  function dismissTutorial() {
    setTutorialDismissed(true);
    try {
      localStorage.setItem("simsar-emlak-tutorial-seen", "1");
    } catch {
      // ignore
    }
  }

  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (lastSavedAt === null) return;
    setShowSavedToast(true);
    const t = setTimeout(() => setShowSavedToast(false), 1600);
    return () => clearTimeout(t);
  }, [lastSavedAt]);

  useEffect(() => {
    if (!socialReaction) return;
    const t = setTimeout(() => setSocialReaction(null), 3200);
    return () => clearTimeout(t);
  }, [socialReaction]);

  useEffect(() => {
    setSavedGames(loadAllSaves());
  }, []);

  const house = allHouses[houseOrder[index] ?? index];
  const intro = house ? (houseIntros[house.id] ?? defaultIntro(house)) : null;
  const isLastHouse = index === allHouses.length - 1;
  const lastResult = results[results.length - 1];
  const maxUnlockedTier = Math.max(...unlockedTiers);

  function persist(
    newResults: HouseResult[],
    newWeekOutcomes: WeekOutcome[],
    newBadges: string[],
    newIndex: number,
    newOwnedPerks: string[],
    newSpent: number,
    newConsumables: Record<string, number> = consumables,
    newUnlockedTiers: number[] = unlockedTiers,
    newHouseOrder: number[] = houseOrder,
    newInbox: InboxMessage[] = inbox,
    newCastAssignment: Record<string, string[]> = castAssignment,
    newDailyQuest: DailyQuestDef | null = dailyQuest,
    slot: number = activeSlot,
    newBonusEarnings: number = bonusEarnings,
    newPendingLoan: PendingLoan | null = pendingLoan,
    newTasksCompleted: number = tasksCompleted,
    newChitchatBonuses: number = chitchatBonuses,
    newPremiumResults: HouseResult[] = premiumResults,
    newPendingInvestment: PendingInvestment | null = pendingInvestment,
    newFriendBonds: Record<string, number> = friendBonds,
    newOwnedInvestmentHouses: OwnedInvestmentHouse[] = ownedInvestmentHouses,
    newInvestmentResults: HouseResult[] = investmentResults,
    newContactedCustomers: ContactedCustomer[] = contactedCustomers,
    newActiveNewsId: string | null = activeNewsId,
    newEnergy: number = energy,
    newPendingDeliveries: PendingDelivery[] = pendingDeliveries,
  ) {
    const save: SaveGame = {
      version: 13,
      index: newIndex,
      houseOrder: newHouseOrder,
      results: newResults,
      weekOutcomes: newWeekOutcomes,
      badges: newBadges,
      ownedPerks: newOwnedPerks,
      consumables: newConsumables,
      unlockedTiers: newUnlockedTiers,
      spent: newSpent,
      inbox: newInbox,
      castAssignment: newCastAssignment,
      dailyQuest: newDailyQuest,
      bonusEarnings: newBonusEarnings,
      pendingLoan: newPendingLoan,
      tasksCompleted: newTasksCompleted,
      chitchatBonuses: newChitchatBonuses,
      premiumResults: newPremiumResults,
      pendingInvestment: newPendingInvestment,
      friendBonds: newFriendBonds,
      ownedInvestmentHouses: newOwnedInvestmentHouses,
      investmentResults: newInvestmentResults,
      contactedCustomers: newContactedCustomers,
      activeNewsId: newActiveNewsId,
      energy: newEnergy,
      pendingDeliveries: newPendingDeliveries,
      savedAt: new Date().toISOString(),
    };
    writeSave(save, slot);
    setSavedGames((prev) => prev.map((s, i) => (i === slot ? save : s)));
    setLastSavedAt(Date.now());
  }

  function openEmlahMenu(tab: EmlahTab = "market") {
    setEmlahMenuTab(tab);
    setShowEmlahMenu(true);
    setSeenInboxCount(inbox.length);
  }

  function handleLineChosen(text: string, fun: number) {
    setBestLineThisHouse((prev) => (prev && prev.fun >= fun ? prev : { text, fun }));
  }

  function applyEffects(effects: ChoiceEffects) {
    const energyFactor = energy < ENERGY_LOW_THRESHOLD ? ENERGY_LOW_SUSPICION_MULTIPLIER : 1;
    const suspicionFactor = suspicionGainFactor(ownedPerks) * difficultyMultiplier[getDifficulty()] * energyFactor;
    setStats((s) => {
      const rawSuspicion = effects.suspicion ?? 0;
      const suspicionDelta = rawSuspicion > 0 ? rawSuspicion * suspicionFactor : rawSuspicion;
      return {
        suspicion: s.suspicion + suspicionDelta,
        interest: s.interest + (effects.interest ?? 0),
        fun: s.fun + (effects.fun ?? 0),
        discountPercent: s.discountPercent + (effects.discountPercent ?? 0),
      };
    });
  }

  function handleFlirt(characterId: string, _characterName: string) {
    const newFriendBonds = { ...friendBonds, [characterId]: (friendBonds[characterId] ?? 0) + FLIRT_BOND_GAIN };
    setFriendBonds(newFriendBonds);
    persist(
      results,
      weekOutcomes,
      badges,
      index,
      ownedPerks,
      spent,
      consumables,
      unlockedTiers,
      houseOrder,
      inbox,
      castAssignment,
      dailyQuest,
      activeSlot,
      bonusEarnings,
      pendingLoan,
      tasksCompleted,
      chitchatBonuses,
      premiumResults,
      pendingInvestment,
      newFriendBonds,
    );
  }

  function enterPhone(
    newIndex: number,
    currentResults: HouseResult[],
    perksList: string[],
    consumablesList: Record<string, number>,
    tiersList: number[],
    order: number[] = houseOrder,
    inboxList: InboxMessage[] = inbox,
    castAssignmentParam: Record<string, string[]> = castAssignment,
    dailyQuestParam: DailyQuestDef | null = dailyQuest,
  ) {
    const nextHouse = allHouses[order[newIndex] ?? newIndex];
    loadHouseImage(nextHouse.id);

    if (nextHouse.tier > Math.max(...tiersList)) {
      setIndex(newIndex);
      setStage("locked");
      return;
    }

    // Occasionally interject a small office task before the next house shows
    // up — otherwise every sale immediately hands you the next assignment
    // and the whole day can blow by in a few clicks.
    if (newIndex > 0 && Math.random() < WORK_TASK_CHANCE) {
      setPendingHouseEntry({
        newIndex,
        currentResults,
        perksList,
        consumablesList,
        tiersList,
        order,
        inboxList,
        castAssignmentParam,
        dailyQuestParam,
      });
      // Same interruption slot/frequency as before (WORK_TASK_CHANCE unchanged) —
      // just a coin flip on which of the two mini-games fills it, for variety.
      if (Math.random() < 0.5) {
        const task = pickWorkTask(lastTaskId);
        setLastTaskId(task.id);
        setActiveTask(task);
        setStage("task");
      } else {
        const quickCall = pickQuickCall(lastQuickCallId);
        setLastQuickCallId(quickCall.id);
        setActiveTask(quickCall);
        setStage("quickcall");
      }
      return;
    }

    proceedToHouseIntro(newIndex, currentResults, perksList, consumablesList, tiersList, order, inboxList, castAssignmentParam, dailyQuestParam, null);
  }

  function proceedToHouseIntro(
    newIndex: number,
    currentResults: HouseResult[],
    perksList: string[],
    consumablesList: Record<string, number>,
    tiersList: number[],
    order: number[],
    inboxList: InboxMessage[],
    castAssignmentParam: Record<string, string[]>,
    dailyQuestParam: DailyQuestDef | null,
    taskReward: { suspicion?: number; interest?: number; fun?: number } | null,
  ) {
    const nextHouse = allHouses[order[newIndex] ?? newIndex];

    // Resolve any loan to Bora that's come due before anything else this visit.
    let newBonusEarnings = bonusEarnings;
    let loanInbox = inboxList;
    if (pendingLoan && newIndex >= pendingLoan.dueIndex) {
      const repaid = Math.random() < LOAN_REPAY_CHANCE;
      const loanMsg: PhoneMessage = repaid
        ? { from: "Bora", text: `Borcunu ödüyorum kanka, sağ ol beklettiğim için! (+${formatTL(pendingLoan.amount)})` }
        : { from: "Bora", text: "Kanka çok mahcubum ama şu an gerçekten elimden bir şey gelmiyor, borcunu şimdilik ödeyemeyeceğim..." };
      loanInbox = logMessages(inboxList, "friend-bora", "Bora", [loanMsg], newIndex + 1);
      if (repaid) newBonusEarnings += pendingLoan.amount;
      setBonusEarnings(newBonusEarnings);
      setPendingLoan(null);
    }
    const newPendingLoan = pendingLoan && newIndex >= pendingLoan.dueIndex ? null : pendingLoan;

    // Resolve the self-funded property from "bora-yatirim", if its time has come.
    if (pendingInvestment && newIndex >= pendingInvestment.dueIndex) {
      const profit = Math.random() < INVESTMENT_PROFIT_CHANCE;
      const investMsg: PhoneMessage = profit
        ? { from: "Bora", text: `O daireyi hatırlıyor musun, satıldı! Payına düşen +${formatTL(INVESTMENT_PROFIT_AMOUNT)}` }
        : { from: "Bora", text: `O daire konusunda kötü haberim var, beklediğimiz gibi gitmedi. Elimize sadece ${formatTL(INVESTMENT_LOSS_AMOUNT)} geçti.` };
      loanInbox = logMessages(loanInbox, "friend-bora", "Bora", [investMsg], newIndex + 1);
      newBonusEarnings += profit ? INVESTMENT_PROFIT_AMOUNT : INVESTMENT_LOSS_AMOUNT;
      setBonusEarnings(newBonusEarnings);
      setPendingInvestment(null);
    }
    const newPendingInvestment =
      pendingInvestment && newIndex >= pendingInvestment.dueIndex ? null : pendingInvestment;

    // Emlah'ın Takvimi — settle any deferred sale payments whose delivery date has arrived.
    const maturedDeliveries = pendingDeliveries.filter((d) => newIndex >= d.dueIndex);
    if (maturedDeliveries.length > 0) {
      for (const d of maturedDeliveries) {
        newBonusEarnings += d.deferredAmount;
        loanInbox = logMessages(
          loanInbox,
          "muzaffer",
          "Muzaffer Bey",
          [{ from: "Muzaffer Bey", text: `${d.houseTitle} teslimi tamamlandı, bekleyen ödeme hesabına geçti: +${formatTL(d.deferredAmount)}` }],
          newIndex + 1,
        );
      }
      setBonusEarnings(newBonusEarnings);
    }
    const newPendingDeliveries = pendingDeliveries.filter((d) => newIndex < d.dueIndex);
    if (newPendingDeliveries.length !== pendingDeliveries.length) setPendingDeliveries(newPendingDeliveries);

    const currentQuest =
      newIndex % HOUSES_PER_WEEK === 0
        ? applyRecoveryBonus(pickDailyQuest(weekIndexForHouse(newIndex)), weekOutcomes)
        : dailyQuestParam;
    setDailyQuest(currentQuest);

    const positionInWeek = newIndex % HOUSES_PER_WEEK;
    let newStats = computeFreshStats(positionInWeek, perksList, consumablesList);
    const nextDistrict = districtOf(nextHouse.location);
    newStats = {
      ...newStats,
      suspicion: Math.max(
        0,
        newStats.suspicion +
          reputationSuspicionOffset(currentResults) +
          districtReputationOffset(currentResults, allHouses, nextDistrict),
      ),
    };
    const flavor = newIndex > 0 ? pickIntroFlavor(currentResults, allHouses, nextDistrict) : { message: null, isLucky: false };
    setIntroFlavorMsg(flavor.message);
    if (flavor.isLucky) {
      newStats = {
        ...newStats,
        interest: Math.min(100, newStats.interest + 15),
        suspicion: Math.max(0, newStats.suspicion - 10),
      };
    }
    if (taskReward) {
      newStats = {
        ...newStats,
        interest: Math.min(100, newStats.interest + (taskReward.interest ?? 0)),
        suspicion: Math.max(0, newStats.suspicion + (taskReward.suspicion ?? 0)),
        fun: Math.min(100, newStats.fun + (taskReward.fun ?? 0)),
      };
    }
    if (pendingMeetupBonus) {
      newStats = {
        ...newStats,
        interest: Math.min(100, newStats.interest + (pendingMeetupBonus.interest ?? 0)),
        fun: Math.min(100, newStats.fun + (pendingMeetupBonus.fun ?? 0)),
      };
      setPendingMeetupBonus(null);
    }
    setStats(newStats);
    const remainingConsumables = consumeOneOfEach(consumablesList);
    setConsumables(remainingConsumables);

    const nextIntro = houseIntros[nextHouse.id] ?? defaultIntro(nextHouse);
    const introMessages = flavor.message ? [flavor.message, ...nextIntro.messages] : nextIntro.messages;
    let newInbox = logMessages(loanInbox, "muzaffer", "Muzaffer Bey", introMessages, newIndex + 1);
    newInbox = pruneInbox(newInbox, currentResults, newIndex + 1);

    if (newIndex > 0 && currentResults.length > 0) {
      const sinceLast = housesSinceLastCallback(newInbox, newIndex + 1);
      const perkBoost = hasPerk(perksList, "referans-agi") ? 0.15 : 0;
      // No back-to-back callbacks; chance ramps up gradually the longer it's
      // been since the last one, capped so it never becomes a certainty.
      const chance = sinceLast <= 1 ? 0 : Math.min(0.55 + perkBoost, 0.12 + sinceLast * 0.07 + perkBoost);
      const callback = maybeGenerateCallback(currentResults, allHouses, chance, castAssignmentParam);
      if (callback) {
        const callbackHouse = allHouses.find((h) => h.id === currentResults[callback.resultIndex].houseId);
        newInbox = logMessages(newInbox, callbackHouse?.id ?? "muzaffer", callback.contactName, callback.messages, newIndex + 1);
        setInbox(newInbox);
        persist(
          currentResults, weekOutcomes, badges, newIndex, perksList, spent, remainingConsumables, tiersList, order,
          newInbox, castAssignmentParam, currentQuest, activeSlot, newBonusEarnings, newPendingLoan, tasksCompleted,
          chitchatBonuses, premiumResults, newPendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults,
          contactedCustomers, activeNewsId, energy, newPendingDeliveries,
        );
        setActiveCallback({ ...callback, sessionKey: `${newIndex}-${callback.resultIndex}-${Date.now()}` });
        setIndex(newIndex);
        setStage("callback");
        return;
      }
    }
    setInbox(newInbox);
    persist(
      currentResults, weekOutcomes, badges, newIndex, perksList, spent, remainingConsumables, tiersList, order,
      newInbox, castAssignmentParam, currentQuest, activeSlot, newBonusEarnings, newPendingLoan, tasksCompleted,
      chitchatBonuses, premiumResults, newPendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults,
      contactedCustomers, activeNewsId, energy, newPendingDeliveries,
    );
    setActiveCallback(null);
    setIndex(newIndex);
    setStage("phone");
  }

  function completeWorkTask(choiceId: string) {
    if (!activeTask || !pendingHouseEntry) return;
    const choice = activeTask.choices.find((c) => c.id === choiceId);
    const p = pendingHouseEntry;
    setActiveTask(null);
    setPendingHouseEntry(null);
    setTasksCompleted((c) => c + 1);
    proceedToHouseIntro(
      p.newIndex,
      p.currentResults,
      p.perksList,
      p.consumablesList,
      p.tiersList,
      p.order,
      p.inboxList,
      p.castAssignmentParam,
      p.dailyQuestParam,
      choice?.reward ?? null,
    );
  }

  // If a tier unlock happens while sitting on the "locked" gate, move on automatically.
  useEffect(() => {
    if (stage === "locked" && house.tier <= maxUnlockedTier) {
      enterPhone(index, results, ownedPerks, consumables, unlockedTiers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedTiers, stage]);

  function startNewGame() {
    const order = tieredShuffle(allHouses.map((h) => h.tier));
    // Rare celebrity easter egg — only ever swapped into premium houses,
    // never touches main/investment assignments (see injectCelebrities).
    const cast = injectCelebrities(assignCast([...allHouses, ...premiumHouses, ...investmentHouses]), premiumHouses);
    const slot = firstAvailableSlot();
    setActiveSlot(slot);
    setHouseOrder(order);
    setResults([]);
    setBadges([]);
    setWeekOutcomes([]);
    setOwnedPerks([]);
    setConsumables({});
    setUnlockedTiers([1]);
    setSpent(0);
    setInbox([]);
    setCastAssignment(cast);
    setDailyQuest(null);
    setDailyQuestResult(null);
    setLastChitchatId(undefined);
    setLastFriendId(undefined);
    setLastTaskId(undefined);
    setActiveCallback(null);
    setBonusEarnings(0);
    setPendingLoan(null);
    setPendingInvestment(null);
    setFriendBonds({});
    setActiveMeetup(null);
    setPendingMeetupBonus(null);
    setTasksCompleted(0);
    setChitchatBonuses(0);
    setPremiumResults([]);
    setSeenInboxCount(0);
    setOwnedInvestmentHouses([]);
    setInvestmentResults([]);
    setContactedCustomers([]);
    setActiveNewsId(null);
    setLastTipsterId(undefined);
    setEnergy(ENERGY_MAX);
    setPendingDeliveries([]);
    lastRankRef.current = null;
    enterPhone(0, [], [], {}, [1], order, [], cast, null);
  }

  function openSaved() {
    setSavedGames(loadAllSaves());
    setStage("saved");
  }

  function continueSaved(slot: number) {
    const savedGame = savedGames[slot];
    if (!savedGame) return;
    setActiveSlot(slot);
    setHouseOrder(savedGame.houseOrder);
    setResults(savedGame.results);
    setBadges(savedGame.badges);
    setWeekOutcomes(savedGame.weekOutcomes);
    setOwnedPerks(savedGame.ownedPerks);
    setConsumables(savedGame.consumables);
    setUnlockedTiers(savedGame.unlockedTiers);
    setSpent(savedGame.spent);
    setInbox(savedGame.inbox);
    setCastAssignment(savedGame.castAssignment);
    setDailyQuestResult(null);
    setBonusEarnings(savedGame.bonusEarnings);
    setPendingLoan(savedGame.pendingLoan);
    setPendingInvestment(savedGame.pendingInvestment ?? null);
    setFriendBonds(savedGame.friendBonds ?? {});
    setTasksCompleted(savedGame.tasksCompleted);
    setChitchatBonuses(savedGame.chitchatBonuses);
    setPremiumResults(savedGame.premiumResults ?? []);
    setSeenInboxCount(savedGame.inbox.length);
    setOwnedInvestmentHouses(savedGame.ownedInvestmentHouses ?? []);
    setInvestmentResults(savedGame.investmentResults ?? []);
    setContactedCustomers(savedGame.contactedCustomers ?? []);
    setActiveNewsId(savedGame.activeNewsId ?? null);
    setEnergy(savedGame.energy ?? ENERGY_MAX);
    setPendingDeliveries(savedGame.pendingDeliveries ?? []);
    lastRankRef.current = null;
    enterPhone(
      savedGame.index,
      savedGame.results,
      savedGame.ownedPerks,
      savedGame.consumables,
      savedGame.unlockedTiers,
      savedGame.houseOrder,
      savedGame.inbox,
      savedGame.castAssignment,
      savedGame.dailyQuest,
    );
  }

  function deleteSaved(slot: number) {
    clearSave(slot);
    setSavedGames((prev) => prev.map((s, i) => (i === slot ? null : s)));
  }

  function handleSceneEnd(outcome: SceneOutcome) {
    if (outcome === "sold") {
      setContractClauses(generateContract());
      setStage("contract");
    } else {
      finalizeResult(outcome, 0);
    }
  }

  function finalizeResult(outcome: SceneOutcome, contractModifier: number, contractSelections?: Record<string, string>) {
    const priorStreak = computeStreak(results);
    const rawSale =
      outcome === "sold"
        ? computeSale(house.askingPrice, stats.discountPercent, priorStreak, contractModifier, rankBonus(earned))
        : null;

    // Emlah'ın Takvimi — a contract's negotiated "Teslim Tarihi" now sets a
    // real future date. Only the deferred portion waits; the immediate
    // share pays out right away exactly as before this feature existed
    // (for "hemen" it's the full amount, 0 behavior change).
    let sale = rawSale;
    let newPendingDeliveries = pendingDeliveries;
    if (rawSale && contractSelections?.teslim) {
      const term = contractSelections.teslim as DeliveryTermId;
      const { immediateAmount, deferredAmount } = splitDeliveryPayment(rawSale.commission, term);
      if (deferredAmount > 0) {
        sale = { ...rawSale, commission: immediateAmount };
        const dueIndex = dueIndexForDelivery(index, term, allHouses.length - 1);
        newPendingDeliveries = [
          ...pendingDeliveries,
          {
            id: `${house.id}-${index}`,
            houseTitle: house.title,
            deliveryDateLabel: formatGameDate(deliveryDateForIndex(index, term)),
            dueIndex,
            deferredAmount,
          },
        ];
        setPendingDeliveries(newPendingDeliveries);
      }
    }

    const newResult: HouseResult = {
      houseId: house.id,
      outcome,
      sale,
      finalStats: stats,
      finalSuspicion: stats.suspicion,
      bestLine: bestLineThisHouse?.text,
      bestLineFun: bestLineThisHouse?.fun,
    };
    const newResults = [...results, newResult];
    setResults(newResults);
    setBestLineThisHouse(null);
    const newContactedCustomers = addContactedCustomer(house, castAssignment, contactedCustomers);
    setContactedCustomers(newContactedCustomers);

    // Rakip Emlakçı Düellosu — bonus-only, never an extra penalty beyond
    // whatever outcome already happened.
    let newBonusEarnings = bonusEarnings;
    let newInbox = inbox;
    if (activeDuelHouseId === house.id) {
      if (outcome === "sold" && sale) {
        const duelBonus = Math.round(house.askingPrice * RIVAL_DUEL_BONUS_RATE);
        newBonusEarnings += duelBonus;
        newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: `${pickDuelWinMessage()} (+${formatTL(duelBonus)})` }], index + 1);
      } else {
        newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: pickDuelLoseMessage() }], index + 1);
      }
      setActiveDuelHouseId(null);
    }

    // Gizli Müşteri — silent until now; reveals itself only in the reaction
    // message, small bonusEarnings adjustment only, never touches suspicion
    // or any stored result.
    if (mysteryShopperHouseId === house.id) {
      const verdict = mysteryShopperVerdict(stats.suspicion);
      if (verdict === "honest") newBonusEarnings += MYSTERY_SHOPPER_HONEST_BONUS;
      else if (verdict === "sneaky") newBonusEarnings -= MYSTERY_SHOPPER_SNEAKY_PENALTY;
      newInbox = logMessages(newInbox, house.id, "Gizli Müşteri", [{ from: "Gizli Müşteri", text: pickMysteryShopperReveal(verdict) }], index + 1);
      setMysteryShopperHouseId(null);
    }
    if (newInbox !== inbox) setInbox(newInbox);

    // Satış Sonrası Sosyal Medya Tepkisi — purely cosmetic, fires only when
    // this sale is this week's best so far.
    if (outcome === "sold" && sale) {
      const weekIdx = weekIndexForHouse(index);
      const weekResultsSoFar = newResults.slice(weekIdx * HOUSES_PER_WEEK, weekIdx * HOUSES_PER_WEEK + HOUSES_PER_WEEK);
      const weekSoldPrices = weekResultsSoFar.filter((r) => r.sale).map((r) => r.sale!.finalPrice);
      const isWeekBest = weekSoldPrices.length > 0 && sale.finalPrice === Math.max(...weekSoldPrices);
      if (isWeekBest) setSocialReaction(generateSocialReaction());
    }

    const gameComplete = index === allHouses.length - 1;
    const newlyEarned = checkNewBadges(newResults, gameComplete, badges, { tasksCompleted, chitchatBonuses });
    const newBadgeIds = newlyEarned.map((b) => b.id);
    const newBadgesState = [...badges, ...newBadgeIds];
    setBadges(newBadgesState);
    setPendingNewBadges(newlyEarned);
    if (newlyEarned.length > 0) setBadgeCelebration(newlyEarned);

    let newWeekOutcomes = weekOutcomes;
    let newEnergy = energy;
    if (isLastHouseOfWeek(index)) {
      newEnergy = Math.min(ENERGY_MAX, energy + WEEKLY_ENERGY_REGEN);
      setEnergy(newEnergy);
      const weekIdx = weekIndexForHouse(index);
      const weekResults = newResults.slice(weekIdx * HOUSES_PER_WEEK, weekIdx * HOUSES_PER_WEEK + HOUSES_PER_WEEK);
      let weekOutcome = evaluateWeek(weekIdx, weekResults);
      if (dailyQuest) {
        const completed = checkDailyQuest(dailyQuest, weekResults);
        if (completed) weekOutcome = { ...weekOutcome, bonus: weekOutcome.bonus + dailyQuest.reward };
        setDailyQuestResult({ def: dailyQuest, completed });
      }
      newWeekOutcomes = [...weekOutcomes, weekOutcome];
      setWeekOutcomes(newWeekOutcomes);
      setPendingWeekOutcome(weekOutcome);
    } else {
      setPendingWeekOutcome(null);
    }

    if (newBonusEarnings !== bonusEarnings) setBonusEarnings(newBonusEarnings);

    persist(
      newResults,
      newWeekOutcomes,
      newBadgesState,
      index,
      ownedPerks,
      spent,
      consumables,
      unlockedTiers,
      houseOrder,
      newInbox,
      castAssignment,
      dailyQuest,
      activeSlot,
      newBonusEarnings,
      pendingLoan,
      tasksCompleted,
      chitchatBonuses,
      premiumResults,
      pendingInvestment,
      friendBonds,
      ownedInvestmentHouses,
      investmentResults,
      newContactedCustomers,
      activeNewsId,
      newEnergy,
      newPendingDeliveries,
    );
    setStage("result");
  }

  function openPremiumHouse(houseId: string) {
    setActivePremiumHouseId(houseId);
    setShowEmlahMenu(false);
  }

  function finishPremiumHouse(outcome: SceneOutcome, contractModifier: number, finalStats: GameStats, contractSelections?: Record<string, string>) {
    const premiumHouse = premiumHouses.find((h) => h.id === activePremiumHouseId);
    if (!premiumHouse) return;
    const rawSale =
      outcome === "sold"
        ? computeSale(premiumHouse.askingPrice, finalStats.discountPercent, 0, contractModifier, rankBonus(earned))
        : null;

    let sale = rawSale;
    let newPendingDeliveries = pendingDeliveries;
    if (rawSale && contractSelections?.teslim) {
      const term = contractSelections.teslim as DeliveryTermId;
      const { immediateAmount, deferredAmount } = splitDeliveryPayment(rawSale.commission, term);
      if (deferredAmount > 0) {
        sale = { ...rawSale, commission: immediateAmount };
        const dueIndex = dueIndexForDelivery(index, term, allHouses.length - 1);
        newPendingDeliveries = [
          ...pendingDeliveries,
          {
            id: `${premiumHouse.id}-${index}-davet`,
            houseTitle: premiumHouse.title,
            deliveryDateLabel: formatGameDate(deliveryDateForIndex(index, term)),
            dueIndex,
            deferredAmount,
          },
        ];
        setPendingDeliveries(newPendingDeliveries);
      }
    }

    const newResult: HouseResult = {
      houseId: premiumHouse.id,
      outcome,
      sale,
      finalStats,
      finalSuspicion: finalStats.suspicion,
    };
    const newPremiumResults = [...premiumResults, newResult];
    setPremiumResults(newPremiumResults);
    const newContactedCustomers = addContactedCustomer(premiumHouse, castAssignment, contactedCustomers);
    setContactedCustomers(newContactedCustomers);
    if (outcome === "sold") playSale();
    else if (outcome === "lost") playLost();
    else playThinking();
    persist(
      results,
      weekOutcomes,
      badges,
      index,
      ownedPerks,
      spent,
      consumables,
      unlockedTiers,
      houseOrder,
      inbox,
      castAssignment,
      dailyQuest,
      activeSlot,
      bonusEarnings,
      pendingLoan,
      tasksCompleted,
      chitchatBonuses,
      newPremiumResults,
      pendingInvestment,
      friendBonds,
      ownedInvestmentHouses,
      investmentResults,
      newContactedCustomers,
      activeNewsId,
      energy,
      newPendingDeliveries,
    );
    setActivePremiumHouseId(null);
    setEmlahMenuTab("davet");
    setShowEmlahMenu(true);
  }

  /** Current market-news swing on the investment-house pool only — 0 when no news is active. Never touches the main/premium pools' askingPrice. */
  function currentNewsModifier(): number {
    if (!activeNewsId) return 0;
    const news = marketNews.find((n) => n.id === activeNewsId);
    if (!news) return 0;
    return news.direction === "up" ? news.magnitude : -news.magnitude;
  }

  function buyInvestmentHouse(houseId: string) {
    const houseDef = investmentHouses.find((h) => h.id === houseId);
    if (!houseDef) return;
    if (ownedInvestmentHouses.some((o) => o.houseId === houseId)) return;
    const price = Math.round(houseDef.askingPrice * (1 + currentNewsModifier()));
    if (balance < price) return;
    const newOwned = [
      ...ownedInvestmentHouses,
      { houseId, purchasePrice: price, condition: rollCondition(), renovationLevel: "yok" as const },
    ];
    const newSpent = spent + price;
    setOwnedInvestmentHouses(newOwned);
    setSpent(newSpent);
    persist(
      results,
      weekOutcomes,
      badges,
      index,
      ownedPerks,
      newSpent,
      consumables,
      unlockedTiers,
      houseOrder,
      inbox,
      castAssignment,
      dailyQuest,
      activeSlot,
      bonusEarnings,
      pendingLoan,
      tasksCompleted,
      chitchatBonuses,
      premiumResults,
      pendingInvestment,
      friendBonds,
      newOwned,
    );
  }

  /** One-time renovation choice per owned flip house — see renovation.ts for the cost/boost math. */
  function renovateInvestmentHouse(houseId: string, level: RenovationLevel) {
    const owned = ownedInvestmentHouses.find((o) => o.houseId === houseId);
    if (!owned || owned.renovationLevel !== "yok") return;
    const cost = renovationCost(level, owned.purchasePrice);
    if (balance < cost) return;
    const newOwned = ownedInvestmentHouses.map((o) => (o.houseId === houseId ? { ...o, renovationLevel: level } : o));
    const newSpent = spent + cost;
    setOwnedInvestmentHouses(newOwned);
    setSpent(newSpent);
    persist(
      results,
      weekOutcomes,
      badges,
      index,
      ownedPerks,
      newSpent,
      consumables,
      unlockedTiers,
      houseOrder,
      inbox,
      castAssignment,
      dailyQuest,
      activeSlot,
      bonusEarnings,
      pendingLoan,
      tasksCompleted,
      chitchatBonuses,
      premiumResults,
      pendingInvestment,
      friendBonds,
      newOwned,
    );
  }

  function openInvestmentSale(houseId: string) {
    setActiveInvestmentSaleId(houseId);
    setShowEmlahMenu(false);
  }

  /** Pitching an owned flip house to a past customer is just a shortcut into the same resale scene, with a small trust bonus for the existing relationship. */
  function pitchInvestmentToContact(contact: ContactedCustomer, houseId: string) {
    if (!ownedInvestmentHouses.some((o) => o.houseId === houseId)) return;
    setPitchTargetContact(contact);
    openInvestmentSale(houseId);
  }

  function finishInvestmentSale(outcome: SceneOutcome, contractModifier: number, finalStats: GameStats, contractSelections?: Record<string, string>) {
    const houseDef = investmentHouses.find((h) => h.id === activeInvestmentSaleId);
    const owned = ownedInvestmentHouses.find((o) => o.houseId === activeInvestmentSaleId);
    if (!houseDef || !owned) return;

    const newsMod = currentNewsModifier();
    // Negative news makes buyers negotiate harder on top of the normal contract swing.
    const newsToughness = newsMod < 0 ? Math.abs(newsMod) * NEWS_RESALE_TOUGHNESS_FACTOR : 0;
    const warmLeadBonus = pitchTargetContact ? 0.02 : 0;
    const gap = renovationGap(owned.condition, owned.renovationLevel);
    const conditionToughness = gap * RENOVATION_GAP_TOUGHNESS;
    const renovationBoost = renovationPriceBoost(owned.renovationLevel);
    const rawSale: SaleResult | null =
      outcome === "sold"
        ? (() => {
            const { finalPrice, profit } = computeInvestmentSale(
              houseDef.askingPrice,
              finalStats.discountPercent,
              contractModifier + warmLeadBonus,
              owned.purchasePrice,
              newsToughness + conditionToughness,
              renovationBoost,
            );
            // `commission` holds net flip profit here, not agency commission — investmentResults is its own isolated array.
            return { finalPrice, commission: profit, discountPercent: finalStats.discountPercent, streakBonus: 0, contractModifier, rankBonus: 0 };
          })()
        : null;

    // Only positive flip profit is worth deferring — a loss just books immediately as before.
    let sale = rawSale;
    let newPendingDeliveries = pendingDeliveries;
    if (rawSale && rawSale.commission > 0 && contractSelections?.teslim) {
      const term = contractSelections.teslim as DeliveryTermId;
      const { immediateAmount, deferredAmount } = splitDeliveryPayment(rawSale.commission, term);
      if (deferredAmount > 0) {
        sale = { ...rawSale, commission: immediateAmount };
        const dueIndex = dueIndexForDelivery(index, term, allHouses.length - 1);
        newPendingDeliveries = [
          ...pendingDeliveries,
          {
            id: `${houseDef.id}-${index}-yatirim`,
            houseTitle: houseDef.title,
            deliveryDateLabel: formatGameDate(deliveryDateForIndex(index, term)),
            dueIndex,
            deferredAmount,
          },
        ];
        setPendingDeliveries(newPendingDeliveries);
      }
    }

    const newResult: HouseResult = {
      houseId: houseDef.id,
      outcome,
      sale,
      finalStats,
      finalSuspicion: finalStats.suspicion,
    };
    const newInvestmentResults = [...investmentResults, newResult];
    setInvestmentResults(newInvestmentResults);

    const newOwnedInvestmentHouses =
      outcome === "sold" ? ownedInvestmentHouses.filter((o) => o.houseId !== activeInvestmentSaleId) : ownedInvestmentHouses;
    setOwnedInvestmentHouses(newOwnedInvestmentHouses);

    const newContactedCustomers = addContactedCustomer(houseDef, castAssignment, contactedCustomers);
    setContactedCustomers(newContactedCustomers);

    const newlyEarnedInvestment = checkNewInvestmentBadges(newInvestmentResults, badges);
    const newBadgesState = [...badges, ...newlyEarnedInvestment.map((b) => b.id)];
    if (newlyEarnedInvestment.length > 0) {
      setBadges(newBadgesState);
      setPendingNewBadges(newlyEarnedInvestment);
      setBadgeCelebration(newlyEarnedInvestment);
    }

    if (outcome === "sold") playSale();
    else if (outcome === "lost") playLost();
    else playThinking();

    persist(
      results,
      weekOutcomes,
      newBadgesState,
      index,
      ownedPerks,
      spent,
      consumables,
      unlockedTiers,
      houseOrder,
      inbox,
      castAssignment,
      dailyQuest,
      activeSlot,
      bonusEarnings,
      pendingLoan,
      tasksCompleted,
      chitchatBonuses,
      premiumResults,
      pendingInvestment,
      friendBonds,
      newOwnedInvestmentHouses,
      newInvestmentResults,
      newContactedCustomers,
      activeNewsId,
      energy,
      newPendingDeliveries,
    );
    setActiveInvestmentSaleId(null);
    setPitchTargetContact(null);
    setEmlahMenuTab("yatirim");
    setShowEmlahMenu(true);
  }

  function proceedAfterResult() {
    if (pendingWeekOutcome) {
      setStage("weekGoal");
      return;
    }
    if (isLastHouse) {
      setStage("summary");
    } else {
      enterPhone(index + 1, results, ownedPerks, consumables, unlockedTiers);
    }
  }

  function proceedAfterWeek() {
    setPendingWeekOutcome(null);
    setDailyQuestResult(null);
    if (isLastHouse) {
      setStage("summary");
    } else {
      enterPhone(index + 1, results, ownedPerks, consumables, unlockedTiers);
    }
  }

  async function downloadShareCard() {
    const ending = computeEnding(results, earned);
    const soldCount = results.filter((r) => r.outcome === "sold").length;
    const dataUrl = await generateShareCard({
      soldCount,
      totalEarned: earned,
      balance,
      reputation: reputationLabel(results),
      rank: rankTitle(earned),
      badgeCount: badges.length,
      endingTitle: ending.title,
      endingDescription: ending.description,
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "simsar-emlak-sonuc.png";
    a.click();
  }

  function buyItem(itemId: string) {
    const item = perks.find((p) => p.id === itemId);
    if (!item) return;

    if (item.energyFill) {
      if (balance < item.cost) return;
      const newSpent = spent + item.cost;
      const newEnergy = Math.min(ENERGY_MAX, energy + item.energyFill);
      setSpent(newSpent);
      setEnergy(newEnergy);
      persist(
        results,
        weekOutcomes,
        badges,
        index,
        ownedPerks,
        newSpent,
        consumables,
        unlockedTiers,
        houseOrder,
        inbox,
        castAssignment,
        dailyQuest,
        activeSlot,
        bonusEarnings,
        pendingLoan,
        tasksCompleted,
        chitchatBonuses,
        premiumResults,
        pendingInvestment,
        friendBonds,
        ownedInvestmentHouses,
        investmentResults,
        contactedCustomers,
        activeNewsId,
        newEnergy,
      );
      return;
    }

    if (item.consumable) {
      if (balance < item.cost) return;
      const newConsumables = { ...consumables, [itemId]: (consumables[itemId] ?? 0) + 1 };
      const newSpent = spent + item.cost;
      setConsumables(newConsumables);
      setSpent(newSpent);
      persist(results, weekOutcomes, badges, index, ownedPerks, newSpent, newConsumables, unlockedTiers);
      return;
    }

    if (ownedPerks.includes(itemId)) return;
    if (item.requires && !ownedPerks.includes(item.requires)) return;
    if (item.unlocksTier && unlockedTiers.includes(item.unlocksTier)) return;
    if (item.requiresSoldCount && results.filter((r) => r.outcome === "sold").length < item.requiresSoldCount) return;
    if (item.requiresOfisItemCount && countOwnedOfisItems(ownedPerks) < item.requiresOfisItemCount) return;
    const price = effectiveCost(item, badges, weekIndexForHouse(index));
    if (balance < price) return;

    const newOwned = [...ownedPerks, itemId];
    const newSpent = spent + price;
    setOwnedPerks(newOwned);
    setSpent(newSpent);

    let newUnlockedTiers = unlockedTiers;
    if (item.unlocksTier) {
      newUnlockedTiers = [...unlockedTiers, item.unlocksTier];
      setUnlockedTiers(newUnlockedTiers);
    }

    persist(results, weekOutcomes, badges, index, newOwned, newSpent, consumables, newUnlockedTiers);
  }

  function handleNegotiationChoice(choiceId: string) {
    if (!activeCallback) return;
    // Look up from this callback's own (tier-appropriate) choice list, not a
    // hardcoded one — luxury houses use differently-worded replies, and
    // falling back to the plain list would silently use the wrong tone.
    const choice = (activeCallback.choices ?? negotiationChoices).find((c) => c.id === choiceId);
    if (!choice) return;

    const original = results[activeCallback.resultIndex];
    const targetHouse = allHouses.find((h) => h.id === original.houseId)!;
    const bias = choice.closingBias * closingBiasMultiplier(ownedPerks);
    const projected: GameStats = {
      suspicion: original.finalStats.suspicion + choice.suspicionDelta,
      interest: original.finalStats.interest + choice.interestDelta,
      fun: original.finalStats.fun + choice.funDelta,
      discountPercent: original.finalStats.discountPercent,
    };
    const outcome2: SceneOutcome = resolveOutcome(projected, bias, targetHouse.profile);

    let updatedResult: HouseResult = { ...original, finalStats: projected, finalSuspicion: projected.suspicion };
    if (outcome2 === "lost") {
      updatedResult = { ...updatedResult, outcome: "lost" };
    }
    const confirmText = pickNegotiationReply(choice, outcome2);

    const newResults = results.map((r, i) => (i === activeCallback.resultIndex ? updatedResult : r));
    setResults(newResults);
    const playerMsg: PhoneMessage = { from: "Emlah", text: choice.text };
    const confirmMsg: PhoneMessage = { from: activeCallback.contactName, text: confirmText };
    let newInbox = logMessages(inbox, targetHouse.id, "Emlah", [playerMsg], index + 1, true);
    newInbox = logMessages(newInbox, targetHouse.id, activeCallback.contactName, [confirmMsg], index + 1);
    setInbox(newInbox);
    persist(newResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, newInbox);

    if (outcome2 === "sold") {
      setPendingCallbackSale({ resultIndex: activeCallback.resultIndex, targetHouse, projectedStats: projected });
    }

    setActiveCallback((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, playerMsg, confirmMsg],
            choices: undefined,
          }
        : prev,
    );
  }

  function finishCallbackContract(modifier: number, contractSelections?: Record<string, string>) {
    if (!pendingCallbackSale) return;
    const { resultIndex, targetHouse, projectedStats } = pendingCallbackSale;
    const original = results[resultIndex];
    const priorStreak = computeStreak(results);
    const rawSale = computeSale(targetHouse.askingPrice, projectedStats.discountPercent, priorStreak, modifier, rankBonus(earned));

    let sale = rawSale;
    let newPendingDeliveries = pendingDeliveries;
    if (contractSelections?.teslim) {
      const term = contractSelections.teslim as DeliveryTermId;
      const { immediateAmount, deferredAmount } = splitDeliveryPayment(rawSale.commission, term);
      if (deferredAmount > 0) {
        sale = { ...rawSale, commission: immediateAmount };
        const dueIndex = dueIndexForDelivery(index, term, allHouses.length - 1);
        newPendingDeliveries = [
          ...pendingDeliveries,
          {
            id: `${targetHouse.id}-${index}-callback`,
            houseTitle: targetHouse.title,
            deliveryDateLabel: formatGameDate(deliveryDateForIndex(index, term)),
            dueIndex,
            deferredAmount,
          },
        ];
        setPendingDeliveries(newPendingDeliveries);
      }
    }

    const updatedResult: HouseResult = {
      ...original,
      outcome: "sold",
      converted: true,
      sale,
      finalStats: projectedStats,
      finalSuspicion: projectedStats.suspicion,
    };
    const newResults = results.map((r, i) => (i === resultIndex ? updatedResult : r));
    setResults(newResults);
    playSale();
    persist(
      newResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox,
      castAssignment, dailyQuest, activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses,
      premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers,
      activeNewsId, energy, newPendingDeliveries,
    );
    setPendingCallbackSale(null);
    setStage("phone");
  }

  function retryFromInbox(houseId: string) {
    const resultIndex = results.findIndex((r) => r.houseId === houseId);
    if (resultIndex === -1) return;
    const result = results[resultIndex];
    if (result.outcome !== "lost" || result.retriedLost) return;
    const targetHouse = allHouses.find((h) => h.id === houseId);
    if (!targetHouse) return;
    const contactName = resolveCustomerNames(targetHouse, castAssignment)[0];

    const updatedResults = results.map((r, i) => (i === resultIndex ? { ...r, retriedLost: true } : r));
    setResults(updatedResults);

    const openingMessages: PhoneMessage[] =
      targetHouse.tier >= 3
        ? [
            { from: contactName, text: `Merhaba, ${targetHouse.title} hakkında ailemizle tekrar konuştuk.` },
            { from: contactName, text: "Bu ölçekte bir karar bizim için kolay değil, ama bir şansımız daha olsun istedik." },
          ]
        : [
            { from: contactName, text: `Merhaba, ${targetHouse.title} hakkında tekrar sizinle konuşmak istedim.` },
            { from: contactName, text: "Belki bir şansımız daha vardır diye düşündüm." },
          ];
    const newInbox = logMessages(inbox, houseId, contactName, openingMessages, index + 1);
    setInbox(newInbox);
    persist(updatedResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, newInbox);

    setActiveCallback({
      resultIndex,
      contactName,
      messages: openingMessages,
      choices: targetHouse.tier >= 3 ? luxuryNegotiationChoices : negotiationChoices,
      sessionKey: `retry-${houseId}-${Date.now()}`,
    });
    setShowEmlahMenu(false);
    setStage("callback");
  }

  function afterIntro() {
    // Independent, non-interrupting ambient side effects — market news (a
    // banner, not a phone message) and tipster pings (a passive inbox log)
    // never touch `stage`, so they can't collide with anything below.
    if (isInvestmentUnlocked(rankTitle(earned))) {
      if (Math.random() < NEWS_CHANCE) {
        const news = pickMarketNews(activeNewsId ?? undefined);
        setActiveNewsId(news.id);
        persist(
          results,
          weekOutcomes,
          badges,
          index,
          ownedPerks,
          spent,
          consumables,
          unlockedTiers,
          houseOrder,
          inbox,
          castAssignment,
          dailyQuest,
          activeSlot,
          bonusEarnings,
          pendingLoan,
          tasksCompleted,
          chitchatBonuses,
          premiumResults,
          pendingInvestment,
          friendBonds,
          ownedInvestmentHouses,
          investmentResults,
          contactedCustomers,
          news.id,
        );
      }
      if (Math.random() < TIPSTER_CHANCE) {
        const tip = pickTipsterMessage(lastTipsterId);
        setLastTipsterId(tip.id);
        const threadId = `tipster-${tip.from.toLowerCase().replace(/\s+/g, "-")}`;
        setInbox((prev) => logMessages(prev, threadId, tip.from, [{ from: tip.from, text: tip.text }], index + 1));
      }
    }
    // Two more independent, silent flags for the upcoming house — neither
    // touches `stage`, and both resolve entirely within finalizeResult()
    // once that house's outcome is known, so they can't collide with
    // anything below or leave a dangling state across house visits.
    if (Math.random() < RIVAL_DUEL_CHANCE) {
      setActiveDuelHouseId(house.id);
      const duelMsg: PhoneMessage = { from: "Muzaffer Bey", text: pickDuelStartMessage(house.title) };
      setInbox((prev) => logMessages(prev, "muzaffer", "Muzaffer Bey", [duelMsg], index + 1));
    } else if (Math.random() < MYSTERY_SHOPPER_CHANCE) {
      // Deliberately silent — a mystery shopper who announced themselves wouldn't be much of a mystery.
      setMysteryShopperHouseId(house.id);
    }
    // Emlah'ın Enerjisi — depletes a fixed amount per house walked into.
    setEnergy((e) => Math.max(0, e - ENERGY_DEPLETION_PER_HOUSE));
    if (index === 0) {
      setStage("house");
      return;
    }
    // Single roll picks at most one extra exchange, so friend messages and
    // boss chitchat never both fire for the same house visit.
    const roll = Math.random();
    if (roll < FRIEND_CHANCE) {
      const set = pickFriendMessage(lastFriendId, pendingLoan !== null, pendingInvestment !== null);
      setLastFriendId(set.id);
      const openMsg: PhoneMessage[] = [{ from: set.contactName, text: set.prompt }];
      setActiveFriendChat({ set, messages: openMsg, showChoices: true });
      const threadId = `friend-${set.contactName.toLowerCase()}`;
      setInbox((prev) => logMessages(prev, threadId, set.contactName, openMsg, index + 1));
      setStage("chitchat");
      return;
    }
    if (roll < FRIEND_CHANCE + CHITCHAT_CHANCE) {
      const set = pickChitchat(lastChitchatId);
      setLastChitchatId(set.id);
      const openMsg: PhoneMessage[] = [{ from: "Muzaffer Bey", text: set.prompt }];
      setActiveChitchat({ set, messages: openMsg, showChoices: true });
      setInbox((prev) => logMessages(prev, "muzaffer", "Muzaffer Bey", openMsg, index + 1));
      setStage("chitchat");
      return;
    }
    // Entirely separate, independently-rare layer — a bonded character
    // reaching out. Only ever fires on top of an otherwise-quiet beat, never
    // stacked with the friend/chitchat rolls above.
    const eligibleCharacterId = Object.keys(friendBonds).find((id) => friendBonds[id] >= MEETUP_BOND_THRESHOLD);
    if (eligibleCharacterId && Math.random() < MEETUP_INVITE_CHANCE) {
      const character = poolCharacterById(eligibleCharacterId);
      if (character) {
        const openMsg: PhoneMessage[] = [{ from: character.name, text: pickInvitePrompt() }];
        setActiveMeetup({ characterId: eligibleCharacterId, characterName: character.name, messages: openMsg, showChoices: true });
        setInbox((prev) => logMessages(prev, `meetup-${eligibleCharacterId}`, character.name, openMsg, index + 1));
        setStage("chitchat");
        return;
      }
    }
    setStage("house");
  }

  function handleFriendChoice(choiceId: string) {
    if (!activeFriendChat) return;
    const choice = activeFriendChat.set.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    const threadId = `friend-${activeFriendChat.set.contactName.toLowerCase()}`;
    const replyMsg: PhoneMessage = { from: "Emlah", text: choice.text };

    let newSpent = spent;
    let newPendingLoan = pendingLoan;
    if (choice.loanAction === "lend" && !pendingLoan) {
      newSpent = spent + LOAN_AMOUNT;
      newPendingLoan = { dueIndex: index + LOAN_DUE_HOUSES, amount: LOAN_REPAY_AMOUNT };
      setSpent(newSpent);
      setPendingLoan(newPendingLoan);
      applyEffects({ fun: 8 });
    }
    let newPendingInvestment = pendingInvestment;
    if (choice.investAction === "invest" && !pendingInvestment && balance >= INVESTMENT_COST) {
      newSpent = newSpent + INVESTMENT_COST;
      // Cap so a late-game investment still resolves by the final house
      // instead of its due date landing past the end of the house list.
      newPendingInvestment = { dueIndex: Math.min(index + INVESTMENT_DUE_HOUSES, allHouses.length - 1) };
      setSpent(newSpent);
      setPendingInvestment(newPendingInvestment);
    }

    let newBonusEarnings = bonusEarnings;
    let bulkDealReaction = choice.reaction;
    if (choice.bulkDealAction === "safe") {
      newBonusEarnings = bonusEarnings + BULK_DEAL_SAFE_AMOUNT;
      setBonusEarnings(newBonusEarnings);
      bulkDealReaction = `${choice.reaction} (+${formatTL(BULK_DEAL_SAFE_AMOUNT)})`;
    } else if (choice.bulkDealAction === "risky") {
      const big = Math.random() < BULK_DEAL_RISKY_BIG_CHANCE;
      const amount = big ? BULK_DEAL_RISKY_BIG_AMOUNT : BULK_DEAL_RISKY_SMALL_AMOUNT;
      newBonusEarnings = bonusEarnings + amount;
      setBonusEarnings(newBonusEarnings);
      bulkDealReaction = big
        ? `Anlaşma büyük çıktı, payınız: +${formatTL(amount)} 🎉`
        : `Anlaşma beklediğimizden küçük oldu ama yine de bir pay çıktı: +${formatTL(amount)}`;
    }

    const reactionMsg: PhoneMessage = { from: activeFriendChat.set.contactName, text: bulkDealReaction };
    const withReply = logMessages(inbox, threadId, "Emlah", [replyMsg], index + 1, true);
    const newInbox = logMessages(withReply, threadId, activeFriendChat.set.contactName, [reactionMsg], index + 1);
    setInbox(newInbox);
    setActiveFriendChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, replyMsg, reactionMsg], showChoices: false } : prev,
    );
    persist(results, weekOutcomes, badges, index, ownedPerks, newSpent, consumables, unlockedTiers, houseOrder, newInbox, castAssignment, dailyQuest, activeSlot, newBonusEarnings, newPendingLoan, tasksCompleted, chitchatBonuses, premiumResults, newPendingInvestment);
  }

  function handleMeetupChoice(activityId: string) {
    if (!activeMeetup) return;
    const activity = meetupActivities.find((a) => a.id === activityId);

    const threadId = `meetup-${activeMeetup.characterId}`;
    const replyMsg: PhoneMessage = { from: "Emlah", text: activity ? activity.label : "Şu an vaktim yok açıkçası." };

    let newSpent = spent;
    let newFriendBonds = friendBonds;
    let reactionText: string;

    if (!activity) {
      reactionText = declineReplies[Math.floor(Math.random() * declineReplies.length)];
    } else if (balance >= activity.cost) {
      newSpent = spent + activity.cost;
      setSpent(newSpent);
      newFriendBonds = { ...friendBonds, [activeMeetup.characterId]: activity.bondGain };
      setFriendBonds(newFriendBonds);
      setPendingMeetupBonus(activity.bonus);
      reactionText = activity.goodReplies[Math.floor(Math.random() * activity.goodReplies.length)];
    } else {
      newFriendBonds = { ...friendBonds, [activeMeetup.characterId]: 0 };
      setFriendBonds(newFriendBonds);
      reactionText = activity.cantAffordReplies[Math.floor(Math.random() * activity.cantAffordReplies.length)];
    }

    const reactionMsg: PhoneMessage = { from: activeMeetup.characterName, text: reactionText };
    const withReply = logMessages(inbox, threadId, "Emlah", [replyMsg], index + 1, true);
    const newInbox = logMessages(withReply, threadId, activeMeetup.characterName, [reactionMsg], index + 1);
    setInbox(newInbox);
    setActiveMeetup((prev) =>
      prev ? { ...prev, messages: [...prev.messages, replyMsg, reactionMsg], showChoices: false } : prev,
    );
    persist(results, weekOutcomes, badges, index, ownedPerks, newSpent, consumables, unlockedTiers, houseOrder, newInbox, castAssignment, dailyQuest, activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, newFriendBonds);
  }

  function handleChitchatChoice(choiceId: string) {
    if (!activeChitchat) return;
    const choice = activeChitchat.set.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    const replyMsg: PhoneMessage = { from: "Emlah", text: choice.text };
    const reactionMsg: PhoneMessage = { from: "Muzaffer Bey", text: choice.reaction };

    if (choice.bonus) {
      applyEffects(choice.bonus);
      setChitchatBonuses((c) => c + 1);
    }

    setInbox((prev) => {
      const withReply = logMessages(prev, "muzaffer", "Emlah", [replyMsg], index + 1, true);
      return logMessages(withReply, "muzaffer", "Muzaffer Bey", [reactionMsg], index + 1);
    });
    setActiveChitchat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, replyMsg, reactionMsg], showChoices: false } : prev,
    );
  }

  const earned =
    results.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0) +
    weekOutcomes.reduce((sum, w) => sum + w.bonus, 0) +
    bonusEarnings +
    premiumResults.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0) +
    // `sale.commission` here holds net flip profit, not agency commission —
    // investmentResults is its own isolated array, so there's no ambiguity.
    investmentResults.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0);
  const balance = earned - spent;
  const anySold = results.some((r) => r.outcome === "sold");
  const unreadCount = inbox.slice(seenInboxCount).filter((m) => !m.fromPlayer).length;

  function handleRootClick(e: MouseEvent<HTMLDivElement>) {
    const target = (e.target as HTMLElement).closest(
      "button.pixel-btn, button.menu-btn, button.choice-btn, button.emlah-tab-btn, button.thread-row, button.wallet-pill-btn, button.market-close, button.thread-back",
    );
    if (target) {
      playClick();
      navigator.vibrate?.(10);
    }
  }

  useEffect(() => {
    if (stage !== "result" || !lastResult) return;
    if (lastResult.outcome === "sold") playSale();
    else if (lastResult.outcome === "lost") playLost();
    else if (lastResult.outcome === "thinking") playThinking();
  }, [stage, lastResult]);

  useEffect(() => {
    if (pendingNewBadges.length > 0) playReward();
  }, [pendingNewBadges]);

  useEffect(() => {
    const currentRank = rankTitle(earned);
    const previousRank = lastRankRef.current;
    if (previousRank !== null && RANK_ORDER.indexOf(currentRank) > RANK_ORDER.indexOf(previousRank)) {
      setRankUpTitle(currentRank);
      setRankUpUnlockedInvites(ranksUnlockNewPremium(previousRank, currentRank));
      playReward();
    }
    lastRankRef.current = currentRank;
  }, [earned]);

  useEffect(() => {
    if (!rankUpTitle) return;
    const t = setTimeout(() => setRankUpTitle(null), 2800);
    return () => clearTimeout(t);
  }, [rankUpTitle]);

  useEffect(() => {
    if (!badgeCelebration) return;
    const t = setTimeout(() => setBadgeCelebration(null), 2800);
    return () => clearTimeout(t);
  }, [badgeCelebration]);

  const marketVisible = stage !== "menu" && stage !== "saved" && stage !== "settings";

  return (
    <div className="game-root" onClick={handleRootClick}>
      {marketVisible && (
        <header className="game-header">
          <h1>Simsar Emlak</h1>
          <span className="subtitle">
            Emlah'ın günü — Ev {index + 1}/{allHouses.length} · {rankTitle(earned)}
          </span>
          {dailyQuest && (
            <span className="quest-banner" title={dailyQuest.description}>
              🎯 {dailyQuest.title}
            </span>
          )}
          <div className="header-actions">
            <button className="wallet-pill wallet-pill-btn" onClick={() => openEmlahMenu("market")}>
              <WalletIcon size={14} className="icon-inline" /> {formatTL(balance)} · Emlah
              {unreadCount > 0 && (
                <span className="unread-dot" key={unreadCount}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      {marketVisible && activeNewsId && isInvestmentUnlocked(rankTitle(earned)) && (
        <NewsBanner news={marketNews.find((n) => n.id === activeNewsId) ?? null} />
      )}

      {rankUpTitle && (
        <div className="rankup-overlay" onClick={() => setRankUpTitle(null)}>
          <div className="rankup-card">
            <StarIcon size={32} />
            <p className="rankup-label">Yeni Rütbe!</p>
            <p className="rankup-title">{rankUpTitle}</p>
            {rankUpUnlockedInvites && <p className="rankup-invite-note">🎁 Ününüz yayılıyor — yeni özel davetler açıldı!</p>}
          </div>
        </div>
      )}

      {badgeCelebration && (
        <div className="rankup-overlay" onClick={() => setBadgeCelebration(null)}>
          <div className="rankup-card">
            <MedalIcon size={32} />
            <p className="rankup-label">Yeni Rozet!</p>
            {badgeCelebration.map((b) => (
              <p className="rankup-title" key={b.id}>
                {b.title}
              </p>
            ))}
          </div>
        </div>
      )}

      {showSavedToast && <div className="saved-toast">Kaydedildi ✓</div>}

      {socialReaction && (
        <div className="social-toast">
          <span className="social-toast-likes">❤️ {socialReaction.likes}</span>
          <span className="social-toast-comment">{socialReaction.comment}</span>
          <span className="social-toast-commenter">— {socialReaction.commenter}</span>
        </div>
      )}

      {showEmlahMenu && (
        <EmlahMenu
          initialTab={emlahMenuTab}
          balance={balance}
          ownedPerks={ownedPerks}
          consumables={consumables}
          unlockedTiers={unlockedTiers}
          onBuy={buyItem}
          inbox={inbox}
          results={results}
          onRetry={retryFromInbox}
          allHouses={allHouses}
          houseOrder={houseOrder}
          currentIndex={index}
          rankTitleText={rankTitle(earned)}
          reputationText={reputationLabel(results)}
          earned={earned}
          badges={badges}
          allBadges={allBadges}
          tasksCompleted={tasksCompleted}
          chitchatBonuses={chitchatBonuses}
          completedWeeks={weekOutcomes.length}
          onClose={() => setShowEmlahMenu(false)}
          premiumHouses={premiumHouses}
          unlockedPremiumIds={unlockedPremiumHouseIds(rankTitle(earned))}
          premiumResults={premiumResults}
          onOpenPremium={openPremiumHouse}
          investmentHouses={investmentHouses}
          investmentUnlocked={isInvestmentUnlocked(rankTitle(earned))}
          ownedInvestmentHouses={ownedInvestmentHouses}
          investmentResults={investmentResults}
          currentNewsModifier={currentNewsModifier()}
          onBuyInvestment={buyInvestmentHouse}
          onSellInvestment={openInvestmentSale}
          onRenovate={renovateInvestmentHouse}
          contactedCustomers={contactedCustomers}
          onPitchInvestment={pitchInvestmentToContact}
          pendingDeliveries={pendingDeliveries}
          currentDateLabel={formatGameDate(gameDateForIndex(index))}
        />
      )}

      {activePremiumHouseId && (
        <div className="premium-overlay">
          <div className="premium-overlay-inner">
            <PremiumHouseScene
              house={premiumHouses.find((h) => h.id === activePremiumHouseId)!}
              ownedPerks={ownedPerks}
              consumables={consumables}
              castAssignment={castAssignment}
              results={results}
              allHouses={allHouses}
              onFinish={finishPremiumHouse}
              energy={energy}
            />
          </div>
        </div>
      )}

      {activeInvestmentSaleId && (
        <div className="premium-overlay">
          <div className="premium-overlay-inner">
            <PremiumHouseScene
              house={investmentHouses.find((h) => h.id === activeInvestmentSaleId)!}
              ownedPerks={ownedPerks}
              consumables={consumables}
              castAssignment={castAssignment}
              results={results}
              allHouses={allHouses}
              onFinish={finishInvestmentSale}
              energy={energy}
              conditionWarning={(() => {
                const owned = ownedInvestmentHouses.find((o) => o.houseId === activeInvestmentSaleId);
                return owned ? renovationGap(owned.condition, owned.renovationLevel) > 0 : false;
              })()}
            />
          </div>
        </div>
      )}

      {pendingCallbackSale && (
        <ContractModal
          clauses={generateContract()}
          customerName={resolveCustomerNames(pendingCallbackSale.targetHouse, castAssignment)[0]}
          onFinish={finishCallbackContract}
        />
      )}

      <div key={stage} className="stage-transition">
      {stage === "menu" && (
        <MainMenu hasSave={hasSave} onNewGame={startNewGame} onOpenSaved={openSaved} onSettings={() => setStage("settings")} />
      )}

      {stage === "saved" && (
        <SavedGames saves={savedGames} onContinue={continueSaved} onDelete={deleteSaved} onBack={() => setStage("menu")} />
      )}

      {stage === "settings" && <SettingsScreen onBack={() => setStage("menu")} />}

      {stage === "locked" && (
        <div className="result-screen locked-preview">
          <p className="locked-preview-tag">🔒 Tier {house.tier} — henüz erişimin yok</p>
          <p className="locked-preview-title">{house.title}</p>
          <p className="locked-preview-location">{house.location}</p>
          <p className="locked-preview-price">{formatTL(house.askingPrice)}</p>
          <p className="menu-empty">Bu evi görebilmek için Ofis Marketi'nden "Portföy Kilidi" bölümüne bakabilirsin.</p>
          <button className="pixel-btn" onClick={() => openEmlahMenu("market")}>
            Marketi Aç
          </button>
        </div>
      )}

      {stage === "callback" && activeCallback && (
        <PhoneScreen
          key={activeCallback.sessionKey}
          messages={activeCallback.messages}
          contactName={activeCallback.contactName}
          avatarSrc={contactAvatar(
            activeCallback.contactName,
            results[activeCallback.resultIndex]?.houseId,
            castAssignment,
          )}
          statusText="mesaj yazdı"
          choices={activeCallback.choices?.map((c) => ({ id: c.id, text: c.text }))}
          onChoice={handleNegotiationChoice}
          onContinue={() => {
            setActiveCallback(null);
            setStage("phone");
          }}
        />
      )}

      {stage === "phone" && intro && !showPhoneOverlay && (
        <OfficeScene
          rankTitleText={rankTitle(earned)}
          ownedPerks={ownedPerks}
          balance={balance}
          unreadCount={unreadCount}
          energy={energy}
          currentDateLabel={formatGameDate(gameDateForIndex(index))}
          onGetJob={() => setShowPhoneOverlay(true)}
          onOpenMessages={() => openEmlahMenu("mesajlar")}
        />
      )}

      {stage === "phone" && intro && showPhoneOverlay && (
        <PhoneScreen
          key={house.id}
          messages={introFlavorMsg ? [introFlavorMsg, ...intro.messages] : intro.messages}
          thought={intro.thought}
          onContinue={afterIntro}
        />
      )}

      {stage === "chitchat" && activeChitchat && (
        <PhoneScreen
          key={`chitchat-${activeChitchat.set.id}-${index}`}
          messages={activeChitchat.messages}
          choices={activeChitchat.showChoices ? activeChitchat.set.choices.map((c) => ({ id: c.id, text: c.text })) : undefined}
          onChoice={handleChitchatChoice}
          onContinue={() => {
            setActiveChitchat(null);
            setStage("house");
          }}
        />
      )}

      {stage === "chitchat" && activeFriendChat && (
        <PhoneScreen
          key={`friend-${activeFriendChat.set.id}-${index}`}
          contactName={activeFriendChat.set.contactName}
          statusText="yazıyor..."
          messages={activeFriendChat.messages}
          choices={activeFriendChat.showChoices ? activeFriendChat.set.choices.map((c) => ({ id: c.id, text: c.text })) : undefined}
          onChoice={handleFriendChoice}
          onContinue={() => {
            setActiveFriendChat(null);
            setStage("house");
          }}
        />
      )}

      {stage === "chitchat" && activeMeetup && (
        <PhoneScreen
          key={`meetup-${activeMeetup.characterId}-${index}`}
          contactName={activeMeetup.characterName}
          statusText="yazıyor..."
          messages={activeMeetup.messages}
          choices={
            activeMeetup.showChoices
              ? [...meetupActivities.map((a) => ({ id: a.id, text: a.label })), { id: "decline", text: "\"Şu an vaktim yok açıkçası.\"" }]
              : undefined
          }
          onChoice={handleMeetupChoice}
          onContinue={() => {
            setActiveMeetup(null);
            setStage("house");
          }}
        />
      )}

      {stage === "task" && activeTask && <WorkTaskScreen task={activeTask} onChoice={completeWorkTask} />}

      {stage === "quickcall" && activeTask && <QuickCallScreen task={activeTask} onChoice={completeWorkTask} />}

      {stage === "house" && (
        <>
          <StatsBar stats={stats} />
          {index === 0 && !tutorialDismissed && (
            <div className="tutorial-tip">
              <p>
                <strong>Şüphe</strong> yükseldikçe satış zorlaşır. <strong>İlgi</strong> ve{" "}
                <strong>Eğlence</strong> ise satışı kolaylaştırır — cevaplarınla bu üçünü dengelemeye çalış.
              </p>
              <button className="pixel-btn small" onClick={dismissTutorial}>
                Anladım
              </button>
            </div>
          )}
          <DialogueScene
            house={house}
            stats={stats}
            ownedPerks={ownedPerks}
            castAssignment={castAssignment}
            onChoiceEffects={applyEffects}
            onSceneEnd={handleSceneEnd}
            onLineChosen={handleLineChosen}
            onFlirt={handleFlirt}
            isDuel={activeDuelHouseId === house.id}
          />
        </>
      )}

      {stage === "contract" && (
        <ContractModal
          clauses={contractClauses}
          customerName={resolveCustomerNames(house, castAssignment)[0]}
          onFinish={(modifier, selections) => finalizeResult("sold", modifier, selections)}
        />
      )}

      {stage === "result" && lastResult && (
        <div className={`result-screen ${lastResult.outcome === "sold" ? "result-sold" : ""}`}>
          {lastResult.outcome === "sold" && (
            <div className="confetti" aria-hidden>
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="confetti-piece" />
              ))}
            </div>
          )}
          <p>{outcomeText[lastResult.outcome]}</p>
          {lastResult.sale && (
            <div className="sale-summary">
              <p>
                Satış Fiyatı: {formatTL(lastResult.sale.finalPrice)}
                {lastResult.sale.discountPercent > 0 && ` (%${lastResult.sale.discountPercent} indirimli)`}
              </p>
              {lastResult.sale.streakBonus > 0 && <p>Seri bonusu: +%{Math.round(lastResult.sale.streakBonus * 100)} 🔥</p>}
              {lastResult.sale.rankBonus > 0 && (
                <p>
                  Rütbe bonusu: +%{Math.round(lastResult.sale.rankBonus * 100)} <StarIcon size={12} className="icon-inline" />
                </p>
              )}
              {lastResult.sale.contractModifier !== 0 && (
                <p>Sözleşme etkisi: {lastResult.sale.contractModifier > 0 ? "+" : ""}%{Math.round(lastResult.sale.contractModifier * 100)}</p>
              )}
              <p>Komisyonunuz: {formatTL(lastResult.sale.commission)}</p>
            </div>
          )}
          {pendingNewBadges.length > 0 && (
            <div className="badge-popup">
              {pendingNewBadges.map((b) => (
                <p key={b.id}>
                  <MedalIcon size={14} className="icon-inline" /> Yeni rozet: {b.title}
                </p>
              ))}
            </div>
          )}
          <button className="pixel-btn" onClick={proceedAfterResult}>
            {isLastHouse ? "Günü Bitir" : "Devam Et"}
          </button>
        </div>
      )}

      {stage === "weekGoal" && pendingWeekOutcome && (
        <WeekResult
          outcome={pendingWeekOutcome}
          balance={balance}
          dailyQuestResult={dailyQuestResult}
          onOpenMarket={() => openEmlahMenu("market")}
          onContinue={proceedAfterWeek}
        />
      )}

      {stage === "summary" && (
        <div className="result-screen">
          <p>Bugünün özeti:</p>
          {allHouses.map((h) => {
            const playedIdx = houseOrder.indexOf(allHouses.indexOf(h));
            const r = results[playedIdx];
            return (
              <p key={h.id}>
                {h.title}: {r ? outcomeText[r.outcome] : "—"}
                {r?.converted ? " (sonradan ikna oldu)" : ""}
              </p>
            );
          })}
          <p className="sale-summary">Toplam Kazanç: {formatTL(earned)}</p>
          <p className="sale-summary">Bakiye: {formatTL(balance)}</p>
          <p className="sale-summary">Unvan: {reputationLabel(results)}</p>
          <p className="sale-summary">Kariyer: {rankTitle(earned)}</p>
          {badges.length > 0 && (
            <div className="badge-popup">
              <p>Kazanılan rozetler:</p>
              {badges.map((id) => (
                <p key={id}>
                  <MedalIcon size={14} className="icon-inline" /> {allBadges[id]?.title ?? id}
                </p>
              ))}
            </div>
          )}
          {(() => {
            const ending = computeEnding(results, earned);
            return (
              <div className="ending-card">
                <p className="ending-title">{ending.title}</p>
                <p className="ending-description">{ending.description}</p>
              </div>
            );
          })()}
          <p className="muzaffer-note">Muzaffer Bey: "{anySold ? "Aferin aslanım, devam!" : "Emlah'ım biraz gayret 😐"}"</p>
          <button className="pixel-btn small" onClick={downloadShareCard}>
            Paylaşım Kartını İndir
          </button>
          <button className="menu-btn" onClick={() => setStage("menu")}>
            Ana Menü
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
