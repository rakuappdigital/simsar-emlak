import { useEffect, useRef, useState, type MouseEvent } from "react";
import PhoneScreen from "./components/PhoneScreen";
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
import { assignCast, resolveCustomerNames, resolvePortrait } from "./data/characterPool";
import { characterImages } from "./data/characterImages";
import { allHouses } from "./data/houses";
import { premiumHouses, unlockedPremiumHouseIds, ranksUnlockNewPremium } from "./data/premiumHouses";
import PremiumHouseScene from "./components/PremiumHouseScene";
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
import { computeStreak, checkNewBadges, allBadges } from "./data/badges";
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
  ContractClause,
  DailyQuestDef,
  GameStats,
  HouseResult,
  HouseScene,
  InboxMessage,
  PendingLoan,
  PendingInvestment,
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
  ) {
    const save: SaveGame = {
      version: 9,
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
    const suspicionFactor = suspicionGainFactor(ownedPerks) * difficultyMultiplier[getDifficulty()];
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
        persist(currentResults, weekOutcomes, badges, newIndex, perksList, spent, remainingConsumables, tiersList, order, newInbox, castAssignmentParam, currentQuest, activeSlot, newBonusEarnings, newPendingLoan, tasksCompleted, chitchatBonuses, premiumResults, newPendingInvestment);
        setActiveCallback({ ...callback, sessionKey: `${newIndex}-${callback.resultIndex}-${Date.now()}` });
        setIndex(newIndex);
        setStage("callback");
        return;
      }
    }
    setInbox(newInbox);
    persist(currentResults, weekOutcomes, badges, newIndex, perksList, spent, remainingConsumables, tiersList, order, newInbox, castAssignmentParam, currentQuest, activeSlot, newBonusEarnings, newPendingLoan, tasksCompleted, chitchatBonuses, premiumResults, newPendingInvestment);
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
    const cast = assignCast([...allHouses, ...premiumHouses]);
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
    setTasksCompleted(0);
    setChitchatBonuses(0);
    setPremiumResults([]);
    setSeenInboxCount(0);
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
    setTasksCompleted(savedGame.tasksCompleted);
    setChitchatBonuses(savedGame.chitchatBonuses);
    setPremiumResults(savedGame.premiumResults ?? []);
    setSeenInboxCount(savedGame.inbox.length);
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

  function finalizeResult(outcome: SceneOutcome, contractModifier: number) {
    const priorStreak = computeStreak(results);
    const sale =
      outcome === "sold"
        ? computeSale(house.askingPrice, stats.discountPercent, priorStreak, contractModifier, rankBonus(earned))
        : null;
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

    const gameComplete = index === allHouses.length - 1;
    const newlyEarned = checkNewBadges(newResults, gameComplete, badges, { tasksCompleted, chitchatBonuses });
    const newBadgeIds = newlyEarned.map((b) => b.id);
    const newBadgesState = [...badges, ...newBadgeIds];
    setBadges(newBadgesState);
    setPendingNewBadges(newlyEarned);
    if (newlyEarned.length > 0) setBadgeCelebration(newlyEarned);

    let newWeekOutcomes = weekOutcomes;
    if (isLastHouseOfWeek(index)) {
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

    persist(newResults, newWeekOutcomes, newBadgesState, index, ownedPerks, spent, consumables, unlockedTiers);
    setStage("result");
  }

  function openPremiumHouse(houseId: string) {
    setActivePremiumHouseId(houseId);
    setShowEmlahMenu(false);
  }

  function finishPremiumHouse(outcome: SceneOutcome, contractModifier: number, finalStats: GameStats) {
    const premiumHouse = premiumHouses.find((h) => h.id === activePremiumHouseId);
    if (!premiumHouse) return;
    const sale =
      outcome === "sold"
        ? computeSale(premiumHouse.askingPrice, finalStats.discountPercent, 0, contractModifier, rankBonus(earned))
        : null;
    const newResult: HouseResult = {
      houseId: premiumHouse.id,
      outcome,
      sale,
      finalStats,
      finalSuspicion: finalStats.suspicion,
    };
    const newPremiumResults = [...premiumResults, newResult];
    setPremiumResults(newPremiumResults);
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
    );
    setActivePremiumHouseId(null);
    setEmlahMenuTab("davet");
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

  function finishCallbackContract(modifier: number) {
    if (!pendingCallbackSale) return;
    const { resultIndex, targetHouse, projectedStats } = pendingCallbackSale;
    const original = results[resultIndex];
    const priorStreak = computeStreak(results);
    const sale = computeSale(targetHouse.askingPrice, projectedStats.discountPercent, priorStreak, modifier, rankBonus(earned));
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
    persist(newResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox);
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
      newPendingInvestment = { dueIndex: index + INVESTMENT_DUE_HOUSES };
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
    premiumResults.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0);
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
        <div className="result-screen">
          <p>Bu ev Tier {house.tier} portföyünde — henüz erişimin yok.</p>
          <p className="menu-empty">Ofis Marketi'nden "Portföy Kilidi" bölümüne bakabilirsin.</p>
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

      {stage === "phone" && intro && (
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
          />
        </>
      )}

      {stage === "contract" && (
        <ContractModal
          clauses={contractClauses}
          customerName={resolveCustomerNames(house, castAssignment)[0]}
          onFinish={(modifier) => finalizeResult("sold", modifier)}
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
