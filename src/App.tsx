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
import { pickIntroFlavor } from "./data/introFlavor";
import { generateShareCard } from "./data/shareCard";
import { getDifficulty, difficultyMultiplier } from "./data/difficulty";
import { loadHouseImage } from "./data/houseImages";
import { logMessages, housesSinceLastCallback, pruneInbox } from "./data/inbox";
import { assignCast, resolveCustomerNames, resolvePortrait } from "./data/characterPool";
import { characterImages } from "./data/characterImages";
import { allHouses } from "./data/houses";
import { COMMISSION_RATE, formatTL } from "./data/economy";
import {
  resolveOutcome,
  streakMultiplier,
  fatigueSuspicion,
  fatigueFactor,
  suspicionGainFactor,
  closingBiasMultiplier,
  rankBonus,
  rankTitle,
  computePrestige,
  prestigeBonus,
} from "./data/scoring";
import { computeStreak, checkNewBadges, allBadges } from "./data/badges";
import { HOUSES_PER_WEEK, isLastHouseOfWeek, weekIndexForHouse, evaluateWeek } from "./data/goals";
import { maybeGenerateCallback, negotiationChoices, luxuryNegotiationChoices, type CallbackEvent } from "./data/callbacks";
import { loadAllSaves, writeSave, clearSave, firstAvailableSlot } from "./data/save";
import { pickDailyQuest, checkDailyQuest } from "./data/dailyQuest";
import { generateContract } from "./data/contract";
import { perks, hasPerk, consumableEffects } from "./data/perks";
import { tieredShuffle } from "./data/shuffle";
import { computeEnding } from "./data/endings";
import type {
  Badge,
  ChoiceEffects,
  ContractClause,
  DailyQuestDef,
  GameStats,
  HouseResult,
  InboxMessage,
  PendingLoan,
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

function computeSale(
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

function reputationLabel(results: HouseResult[]): string {
  if (results.length === 0) return "";
  const avg = results.reduce((s, r) => s + r.finalSuspicion, 0) / results.length;
  if (avg <= 25) return "Dürüst Simsar";
  if (avg <= 45) return "Dengeli Simsar";
  return "İstanbul'un En Sinsi Emlakçısı";
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

function computeFreshStats(
  positionInWeek: number,
  perksList: string[],
  consumablesList: Record<string, number>,
): GameStats {
  const factor = fatigueFactor(perksList);
  const prestige = computePrestige(perksList);
  const { interest: prestigeInterest, fun: prestigeFun } = prestigeBonus(prestige);
  let stats: GameStats = {
    suspicion: fatigueSuspicion(positionInWeek, factor),
    interest: prestigeInterest,
    fun: (hasPerk(perksList, "sansli-nal") ? 10 : 0) + prestigeFun,
    discountPercent: 0,
  };

  for (const [id, count] of Object.entries(consumablesList)) {
    if (count > 0) {
      const effect = consumableEffects[id];
      if (effect) {
        stats = {
          ...stats,
          suspicion: stats.suspicion + (effect.suspicion ?? 0),
          interest: stats.interest + (effect.interest ?? 0),
          fun: stats.fun + (effect.fun ?? 0),
        };
      }
    }
  }
  return stats;
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
  const [badgeCelebration, setBadgeCelebration] = useState<Badge[] | null>(null);
  const lastRankRef = useRef<string | null>(null);
  const [dailyQuest, setDailyQuest] = useState<DailyQuestDef | null>(null);
  const [dailyQuestResult, setDailyQuestResult] = useState<{ def: DailyQuestDef; completed: boolean } | null>(null);
  const [introFlavorMsg, setIntroFlavorMsg] = useState<PhoneMessage | null>(null);
  const [activeTask, setActiveTask] = useState<WorkTaskDef | null>(null);
  const [lastTaskId, setLastTaskId] = useState<string | undefined>(undefined);
  const [pendingHouseEntry, setPendingHouseEntry] = useState<PendingHouseEntry | null>(null);
  const [bonusEarnings, setBonusEarnings] = useState(0);
  const [pendingLoan, setPendingLoan] = useState<PendingLoan | null>(null);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [chitchatBonuses, setChitchatBonuses] = useState(0);
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
  ) {
    const save: SaveGame = {
      version: 7,
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
      const task = pickWorkTask(lastTaskId);
      setLastTaskId(task.id);
      setActiveTask(task);
      setStage("task");
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

    const currentQuest = newIndex % HOUSES_PER_WEEK === 0 ? pickDailyQuest(weekIndexForHouse(newIndex)) : dailyQuestParam;
    setDailyQuest(currentQuest);

    const positionInWeek = newIndex % HOUSES_PER_WEEK;
    let newStats = computeFreshStats(positionInWeek, perksList, consumablesList);
    const flavor = newIndex > 0 ? pickIntroFlavor(currentResults) : { message: null, isLucky: false };
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
        persist(currentResults, weekOutcomes, badges, newIndex, perksList, spent, remainingConsumables, tiersList, order, newInbox, castAssignmentParam, currentQuest, activeSlot, newBonusEarnings, newPendingLoan, tasksCompleted, chitchatBonuses);
        setActiveCallback({ ...callback, sessionKey: `${newIndex}-${callback.resultIndex}-${Date.now()}` });
        setIndex(newIndex);
        setStage("callback");
        return;
      }
    }
    setInbox(newInbox);
    persist(currentResults, weekOutcomes, badges, newIndex, perksList, spent, remainingConsumables, tiersList, order, newInbox, castAssignmentParam, currentQuest, activeSlot, newBonusEarnings, newPendingLoan, tasksCompleted, chitchatBonuses);
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
    const cast = assignCast(allHouses);
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
    setTasksCompleted(0);
    setChitchatBonuses(0);
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
    setTasksCompleted(savedGame.tasksCompleted);
    setChitchatBonuses(savedGame.chitchatBonuses);
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
    if (balance < item.cost) return;

    const newOwned = [...ownedPerks, itemId];
    const newSpent = spent + item.cost;
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
    const choice = negotiationChoices.find((c) => c.id === choiceId);
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

    let confirmText: string;
    let updatedResult: HouseResult = { ...original, finalStats: projected, finalSuspicion: projected.suspicion };

    if (outcome2 === "sold") {
      const sale = computeSale(targetHouse.askingPrice, original.finalStats.discountPercent, 0, 0, rankBonus(earned));
      updatedResult = { ...updatedResult, outcome: "sold", converted: true, sale };
      confirmText = "Harika, süreci hemen başlatıyorum! 🎉";
    } else if (outcome2 === "lost") {
      updatedResult = { ...updatedResult, outcome: "lost" };
      confirmText = "Anlıyorum, sanırım başka bir seçeneğe bakacağız.";
    } else {
      confirmText = "Anlaşıldı, biraz daha düşünelim, haber veririz.";
    }

    const newResults = results.map((r, i) => (i === activeCallback.resultIndex ? updatedResult : r));
    setResults(newResults);
    const playerMsg: PhoneMessage = { from: "Emlah", text: choice.text };
    const confirmMsg: PhoneMessage = { from: activeCallback.contactName, text: confirmText };
    let newInbox = logMessages(inbox, targetHouse.id, "Emlah", [playerMsg], index + 1, true);
    newInbox = logMessages(newInbox, targetHouse.id, activeCallback.contactName, [confirmMsg], index + 1);
    setInbox(newInbox);
    persist(newResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, newInbox);

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
      const set = pickFriendMessage(lastFriendId, pendingLoan !== null);
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
    const reactionMsg: PhoneMessage = { from: activeFriendChat.set.contactName, text: choice.reaction };

    let newSpent = spent;
    let newPendingLoan = pendingLoan;
    if (choice.loanAction === "lend" && !pendingLoan) {
      newSpent = spent + LOAN_AMOUNT;
      newPendingLoan = { dueIndex: index + LOAN_DUE_HOUSES, amount: LOAN_REPAY_AMOUNT };
      setSpent(newSpent);
      setPendingLoan(newPendingLoan);
      applyEffects({ fun: 8 });
    }

    const withReply = logMessages(inbox, threadId, "Emlah", [replyMsg], index + 1, true);
    const newInbox = logMessages(withReply, threadId, activeFriendChat.set.contactName, [reactionMsg], index + 1);
    setInbox(newInbox);
    setActiveFriendChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, replyMsg, reactionMsg], showChoices: false } : prev,
    );
    persist(results, weekOutcomes, badges, index, ownedPerks, newSpent, consumables, unlockedTiers, houseOrder, newInbox, castAssignment, dailyQuest, activeSlot, bonusEarnings, newPendingLoan, tasksCompleted, chitchatBonuses);
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
    bonusEarnings;
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
