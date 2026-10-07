import { useCallback, useMemo, useEffect, useRef, useState, lazy, Suspense, type MouseEvent, type ReactElement, type SVGProps } from "react";
import PhoneScreen from "./components/PhoneScreen";
import ResultCard from "./components/ResultCard";
import SideStoryModal from "./components/SideStoryModal";
import { useSideQuests } from "./hooks/useSideQuests";
import { emptySideQuests, normalizeSideQuests } from "./data/sideQuests";
import { secretHouseById } from "./data/secretHouses";
import { isNightHours } from "./data/specialDays";
import OfficeScene from "./components/OfficeScene";
import DialogueScene from "./components/DialogueScene";
import StatsBar from "./components/StatsBar";
import MainMenu from "./components/MainMenu";
import LanguageSelectScreen from "./components/LanguageSelectScreen";
import SplashScreen from "./components/SplashScreen";
import PaywallScreen from "./components/PaywallScreen";
import {
  DEMO_HOUSE_LIMIT,
  isFullUnlocked,
  isAdsRemoved,
  purchaseFullUnlock,
  purchaseBundleFullJetton30,
  syncPurchasesFromRevenueCat,
} from "./data/purchases";
import { showInterstitialAd } from "./data/ads";
import { shouldShowInterstitialOnDayAdvance } from "./data/adSchedule";
import {
  inventoryItems,
  SUSPICION_SHIELD_HOUSES,
  SUSPICION_SHIELD_DISCOUNT,
  LUCKY_CALL_INTEREST_BONUS,
  LUCKY_CALL_SUSPICION_DISCOUNT,
  CONFIDENCE_OUTFIT_DISCOUNT,
  DESK_LAMP_INTEREST_BONUS,
  WALL_PAINTING_FUN_BONUS,
  POTTED_PLANT_SUSPICION_DISCOUNT,
  COFFEE_MACHINE_ENERGY,
  COMFORT_CHAIR_ENERGY,
  TROPHY_SHELF_INTEREST_BONUS,
  NEW_SIGN_BOSS_MOOD_GAIN,
  FLAWLESS_IMPRESSION_FUN_BONUS,
  BOSS_NOTE_MOOD_GAIN,
  SOLID_REFERENCE_SUSPICION_DISCOUNT,
  ENERGY_RESERVE_AMOUNT,
  LUCKY_APPOINTMENT_INTEREST_BONUS,
  getShieldHousesLeft,
  setShieldHousesLeft,
} from "./data/inventory";
import { getPlaysRemaining, recordPlay, hasPlayedAllMinigames } from "./data/minigameSchedule";
import { initGameCenter, unlockAchievement, ACHIEVEMENT_IDS, submitLeaderboardScore } from "./data/gameCenter";
import { claimDailyRewardIfEligible } from "./data/dailyReward";
import { initRevenueCat } from "./data/revenuecat";
import { waitForTrackingDecision } from "./data/tracking";
import {
  dayActivities,
  RESEARCH_SUSPICION_DISCOUNT,
  MARKETING_BOSS_MOOD_BY_TIER,
  MARKETING_PERFECT_INTEREST,
  OFFICE_WORK_EARNINGS_BY_TIER,
  FORGOTTEN_FILE_CHANCE,
} from "./data/dayActivities";
import { activityMiniGames, type ActivityTier } from "./components/ActivityMiniGames";
import {
  getJettons,
  addJettons,
  spendJettons,
  TIER_SKIP_JETTON_COST,
  purchaseJettonPackage,
  JETTON_ENERGY_REFILL_COST,
  JETTON_ENERGY_REFILL_AMOUNT,
  type JettonPackage,
} from "./data/jettons";
import { getLanguage, hasChosenLanguage, resolveText, resolveHouseTitle, resolveHouseLocation, t, type Language } from "./data/language";
const SavedGames = lazy(() => import("./components/SavedGames"));
const SettingsScreen = lazy(() => import("./components/SettingsScreen"));
const StoreScreen = lazy(() => import("./components/StoreScreen"));
import WeekResult from "./components/WeekResult";
import ContractModal from "./components/ContractModal";
import type { EmlahTab } from "./components/EmlahMenu";
const EmlahMenu = lazy(() => import("./components/EmlahMenu"));
const MessagesPanel = lazy(() => import("./components/MessagesPanel"));
const IslerPanel = lazy(() => import("./components/IslerPanel"));
import { WalletIcon, StarIcon, MedalIcon, ChalkboardIcon, KeyRingIcon, BriefcaseIcon, CompassIcon, GearIcon, PhoneDeviceIcon, DiskIcon, CoinIcon, IdCardIcon, OfficeIcon, ShopBagIcon, GiftBundleIcon, TrophyIcon, LockIcon, CheckIcon, PhoneCallIcon, HeartIcon, CloseIcon } from "./components/icons";
import { playClick, playSale, playLost, playReward, playThinking, playPurchase, playDayAdvance, startMusic, getMusicVolume, startSaleMusic, stopSaleMusic } from "./data/sound";
import SaleIntroModal from "./components/SaleIntroModal";
import { houseIntros, defaultIntro, welcomeIntro } from "./data/intro";
import { pickChitchat, type ChitchatSet } from "./data/chitchat";
import { pickFriendMessage, type FriendMessageSet } from "./data/friendFlavor";
import WorkTaskScreen from "./components/WorkTaskScreen";
import { pickWorkTask, type WorkTaskDef } from "./data/workTasks";
import { pickQuickCall } from "./data/quickCall";
import { pickStagingTask } from "./data/staging";
import { pickSuspiciousDetail } from "./data/suspiciousDetails";
import QuickCallScreen from "./components/QuickCallScreen";
import {
  pickIntroFlavor,
  reputationLabel,
  reputationLabelDisplay,
  reputationSuspicionOffset,
  districtOf,
  districtReputationOffset,
} from "./data/introFlavor";
import { generateShareCard } from "./data/shareCard";
import { getDifficulty, difficultyMultiplier } from "./data/difficulty";
import { loadHouseImage } from "./data/houseImages";
import { logMessages, pruneInbox, markThreadRead, unreadCountOf, isUnread, isFlavorThread, logFlavorMessage } from "./data/inbox";
import { pickWhatsAppNotification } from "./data/whatsappNotifications";
import NotificationBanner, { type BannerData } from "./components/NotificationBanner";
import { assignCast, resolveCustomerNames, resolvePortrait, poolCharacterById } from "./data/characterPool";
import { injectCelebrities, celebrityById } from "./data/celebrities";
import { countOwnedOfisItems } from "./data/officeImages";
import { RIVAL_DUEL_CHANCE, RIVAL_DUEL_BONUS_RATE, pickDuelStartMessage, pickDuelWinMessage, pickDuelLoseMessage } from "./data/rivalDuel";
import { rivalTotalSales } from "./data/rival";
import { firatMoodFor, firatFullCircleLines, type FiratMoodDef } from "./data/rivalCharacter";
import { friendHouses, friendHouseById } from "./data/friendHouses";
import { buildContactBook } from "./data/contactBook";
import { buildDistrictPins, isDistrictDominated, DISTRICT_DOMINANCE_SUSPICION_DISCOUNT } from "./data/istanbulMap";
import type { EndingSlide } from "./components/EndingSequence";
const EndingSequence = lazy(() => import("./components/EndingSequence"));
import RadioTicker from "./components/RadioTicker";
import { pickCityPulseLine } from "./data/cityPulse";
import { checkSelfReflectionTrigger, selfReflectionText, type ReflectionKind } from "./data/selfReflection";
import {
  MYSTERY_SHOPPER_CHANCE,
  MYSTERY_SHOPPER_HONEST_BONUS,
  MYSTERY_SHOPPER_SNEAKY_PENALTY,
  mysteryShopperVerdict,
  pickMysteryShopperReveal,
} from "./data/mysteryShopper";
import { EASTER_EGG_CHANCE, pickEasterEgg, type EasterEgg } from "./data/easterEggs";
import { seasonalFilterFragment } from "./data/seasonalTint";
import { REAL_WORLD_FLAVOR_CHANCE, pickRealWorldFlavorLine } from "./data/realWorldFlavor";
import { recordClick, milestoneMessage } from "./data/clickCounter";
import { printConsoleEasterEgg } from "./data/consoleEasterEgg";
import { classifyChoiceTone, personalitySummary } from "./data/voiceTone";
import { classifyCompassChoice, compassVerdict } from "./data/valuesCompass";
import { origins, originById, originEndingLine, LOYALTY_THRESHOLD } from "./data/origin";
import {
  maybeRecordMemory,
  pushMemory,
  pickEligibleMemory,
  consumeMemory,
  memoryReputationSuspicionNudge,
  MEMORY_REFERENCE_CHANCE,
} from "./data/significantMemory";
const OriginSelectScreen = lazy(() => import("./components/OriginSelectScreen"));
const NewGameSetupScreen = lazy(() => import("./components/NewGameSetupScreen"));
import { triggerHaptic } from "./data/haptics";
import { generateSocialReaction, type SocialReaction } from "./data/socialReaction";
import {
  type RenovationLevel,
  rollCondition,
  renovationGap,
  renovationCost,
  renovationPriceBoost,
  RENOVATION_GAP_TOUGHNESS,
} from "./data/renovation";
import {
  ENERGY_MAX,
  ENERGY_DEPLETION_PER_HOUSE,
  ENERGY_LOW_THRESHOLD,
  ENERGY_LOW_SUSPICION_MULTIPLIER,
  WEEKLY_ENERGY_REGEN,
  ENERGY_WORK_MIN_THRESHOLD,
  AD_ENERGY_REWARD,
  computePassiveEnergyRegen,
} from "./data/energy";
import { energyBreakActivities } from "./data/energyBreak";
const EnergyBreakScreen = lazy(() => import("./components/EnergyBreakScreen"));
import type { MiniGameTier } from "./components/EnergyMiniGames";
import {
  type DeliveryTermId,
  gameDateForIndex,
  formatGameDate,
  formatGameDateTime,
  gameTimeForIndex,
  deliveryDateForIndex,
  dueIndexForDelivery,
  splitDeliveryPayment,
} from "./data/calendar";
import {
  BATTERY_MAX,
  BATTERY_LOW_THRESHOLD,
  LOW_BATTERY_CHOICE_ID,
  lowBatteryLine,
  maybeDrainBattery,
  pickLowBatteryReply,
} from "./data/battery";
import {
  BOSS_MOOD_START,
  DISCOUNT_ANGER_THRESHOLD,
  BOSS_MOOD_WEEK_GOAL_GAIN,
  BOSS_MOOD_RAISE_THRESHOLD,
  WEEKLY_RAISE_AMOUNT,
  clampBossMood,
  bossMoodDeltaForSale,
  pickDiscountAngerLine,
  pickCleanSaleLine,
} from "./data/bossMood";
import { seasonalEventForWeek } from "./data/seasonalEvents";
import { getPrestigeCompletions, recordGameCompletion, prestigeStartingBonus, prestigeTitle } from "./data/prestige";
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
const PremiumHouseScene = lazy(() => import("./components/PremiumHouseScene"));
const SecretStatsScreen = lazy(() => import("./components/SecretStatsScreen"));
import { investmentHouses, isInvestmentUnlocked } from "./data/investmentHouses";
import { marketNews, pickMarketNews } from "./data/marketNews";
import { pickTipsterMessage } from "./data/tipsters";
import NewsBanner from "./components/NewsBanner";
import { COMMISSION_RATE, formatTL } from "./data/economy";
import {
  resolveOutcome,
  streakMultiplier,
  suspicionGainFactor,
  skillSuspicionFactor,
  closingBiasMultiplier,
  rankBonus,
  rankInterestBonus,
  rankTitle,
  rankTitleDisplay,
  computeFreshStats,
} from "./data/scoring";
import { skillTree, canUnlockSkill, xpForOutcome, startingBonusForSkills } from "./data/skillTree";
import { activeRivalFor, rivalLadder } from "./data/rivalLadder";
import { FRIEND_BOND_MILESTONES, friendBondMilestoneLine } from "./data/friendBondMilestones";
import { friendCharacters, friendCharacterForHouseId } from "./data/friendCharacters";
import {
  FLASHBACK_CHANCE,
  FLASHBACK_MIN_INDEX,
  pickFlashbackMemory,
  flashbackTextFor,
} from "./data/timeTravelerFlashback";
import { FATEFUL_MOMENT_INDICES, fatefulMomentFor } from "./data/fatefulMoments";
import {
  SECOND_CHANCE_CHANCE,
  SECOND_CHANCE_MIN_INDEX,
  pickSecondChanceCandidateIndex,
  pickSecondChanceLine,
} from "./data/secondChanceEvent";
import {
  POST_SALE_CALL_MIN_INDEX,
  pickPostSaleCallCandidateIndex,
  pickPostSaleCall,
  type PostSaleCallDef,
} from "./data/postSaleCall";
import { suspiciousDetailConfessions } from "./data/suspiciousDetails";
import PostSaleCallScreen from "./components/PostSaleCallScreen";
import { computeStreak, checkNewBadges, checkNewInvestmentBadges, allBadges } from "./data/badges";
import { HOUSES_PER_WEEK, isLastHouseOfWeek, weekIndexForHouse, evaluateWeek } from "./data/goals";
import { generateCallbackForResult, negotiationChoices, luxuryNegotiationChoices, pickNegotiationReply, type CallbackEvent } from "./data/callbacks";
import { rollFollowUpReaction, pickEmlahFollowUpLine, pickFollowUpReply, FOLLOWUP_WARM_SUSPICION_DELTA, FOLLOWUP_WARM_INTEREST_DELTA, FOLLOWUP_ANNOYED_SUSPICION_DELTA, FOLLOWUP_ANNOYED_INTEREST_DELTA } from "./data/followUp";
import { isToneContradiction, pickToneContradictionLine, NEGOTIATION_TONE_CONTRADICTION_PENALTY } from "./data/contradiction";
import {
  favorRequestLine,
  favorAcceptReply,
  favorDeclineReply,
  yakinlikEpilogueLine,
  FAVOR_ACCEPT_COST,
  FAVOR_ACCEPT_BOND_BONUS,
  BREADTH_CONFRONTATION_MIN_FRIENDS,
  breadthConfrontationLine,
  stageForBondCount,
  hardTimesAskLine,
  hardTimesReplyLine,
  hardTimesReward,
  HARD_TIMES_BOND_THRESHOLD,
  HARD_TIMES_BOSS_MOOD_THRESHOLD,
  HARD_TIMES_LOSS_STREAK,
  HARD_TIMES_BOND_BONUS,
} from "./data/relationshipStages";
import { loadAllSaves, writeSave, clearSave, firstAvailableSlot, markSavedThreadRead, patchSave } from "./data/save";
import { pickDailyQuest, checkDailyQuest, applyRecoveryBonus } from "./data/dailyQuest";
import { generateContract } from "./data/contract";
import { perks, hasPerk, effectiveCost } from "./data/perks";
import { tieredShuffle } from "./data/shuffle";
import { POSTPONE_SUSPICION_PENALTY, DECLINE_BOSS_MOOD_PENALTY, pickDeclineBossLine } from "./data/jobDecisions";
import { computeEnding } from "./data/endings";
import { track, setAnalyticsContext } from "./data/analytics";
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
  PendingCallback,
  PausedVisit,
  PhoneMessage,
  SaleResult,
  SaveGame,
  SceneOutcome,
  WeekOutcome,
  ToneBucket,
  CompassAxis,
  OriginId,
  SignificantMemory,
} from "./types";
import "./game.css";

type Stage =
  | "menu"
  | "setup"
  | "origin"
  | "saved"
  | "settings"
  | "store"
  | "callback"
  | "phone"
  | "chitchat"
  | "task"
  | "quickcall"
  | "postsalecall"
  | "house"
  | "contract"
  | "locked"
  | "paywall"
  | "result"
  | "weekGoal"
  | "summary";

// "Emlah'ın Geçmişi" — one hand-drawn pixel icon per origin, shown at rank-ups. See data/origin.ts.
const originIcons: Record<OriginId, (props: SVGProps<SVGSVGElement> & { size?: number }) => ReactElement> = {
  ogretmen: ChalkboardIcon,
  "emlakci-ailesi": KeyRingIcon,
  girisimci: BriefcaseIcon,
  yurtdisi: CompassIcon,
};

const CHITCHAT_CHANCE = 0.27;
const FRIEND_CHANCE = 0.08;
// "Arkadaş Desteği" — Yakınlık-stage friends occasionally help before a
// visit. See the stat-nudge block in proceedToHouseIntro.
const FRIEND_ASSIST_CHANCE = 0.2;
const FRIEND_ASSIST_INTEREST_BONUS = 6;
const FRIEND_ASSIST_SUSPICION_DISCOUNT = 5;
// "Zaman Kıtlığı" — a small, unconditional energy cost for accepting a
// friend's house tip. Without this, deepening every friendship was
// completely free — accepting was always the strictly dominant choice.
// This gives relationship investment a real, if modest, opportunity cost
// against the SAME energy budget everything else competes for.
const FRIEND_TIP_ENERGY_COST = 5;
// Purely a background toast, never a screen — can safely roll independently
// of every other detour system without any collision guard.
const CITY_PULSE_CHANCE = 0.22;
// Lowered from 0.4 and paired with hadWorkTaskThisTransition below — together
// they cut "at least one detour before reaching the house" from ~61% to
// ~54.5% and eliminate the ~14% chance of two detour screens stacking on
// the same transition, without changing the friend/chitchat system's own
// long-run frequency (loan/investment/bond threads still fire at their
// normal rate, just never doubled up with an office-task screen).
const WORK_TASK_CHANCE = 0.3;
// "Yeni Güne Geç" artık her zaman iş garanti etmiyor — bkz handleAdvanceDay.
const JOB_AVAILABLE_CHANCE = 0.7;
const JOB_UNSOLD_PENALTY = 0.4;
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
// A real agency moment at every promotion instead of a purely passive
// number crossing a threshold — a real, if modest, injection into the
// skill tree's XP economy right when the rank-up card already has the
// player's attention.
const RANK_UP_SKILL_XP_BONUS = 10;
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

/** S5 — oyuna girdikten sonra bu süre boyunca yeni mesajlar bildirim göstermez (açılışta biriken mesajlar). */
const BANNER_QUIET_AFTER_ENTER_MS = 2500;

/** Kilit ekranı gereklilik işareti — emoji yerine kendi ikonumuz. */
function ReqMark({ met }: { met: boolean }) {
  return met ? <CheckIcon size={12} className="icon-inline req-met" /> : <span className="req-box" aria-hidden />;
}

const outcomeTextByLang: Record<SceneOutcome, { tr: string; en: string }> = {
  sold: { tr: "Satış tamamlandı!", en: "Sale complete!" },
  thinking: { tr: "Müşteri düşünüyor...", en: "Customer is thinking..." },
  lost: { tr: "Satış kaybedildi.", en: "Sale lost." },
};
function outcomeText(outcome: SceneOutcome, declined?: boolean): string {
  if (declined) return t({ tr: "İşi reddettin. Sıradaki müşteriye geçiliyor.", en: "You turned the job down. Moving on to the next client." });
  return resolveText(outcomeTextByLang[outcome]);
}

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

// "İkram Et" turned these two from a passive pre-house buff into an
// interactive in-scene choice (see DialogueScene.tsx) — they now persist in
// stock until the player actually offers them, instead of auto-consuming
// (and silently paying out their old flat bonus) the moment a house starts.
const IKRAM_ITEMS_NOT_AUTO_CONSUMED = ["seker-ikrami", "kahve-ikrami"];

function consumeOneOfEach(consumables: Record<string, number>): Record<string, number> {
  const remaining = { ...consumables };
  for (const id of Object.keys(remaining)) {
    if (IKRAM_ITEMS_NOT_AUTO_CONSUMED.includes(id)) continue;
    if (remaining[id] > 0) remaining[id] -= 1;
  }
  return remaining;
}

interface PersistRequired {
  results: HouseResult[];
  weekOutcomes: WeekOutcome[];
  badges: string[];
  index: number;
  ownedPerks: string[];
  spent: number;
}

interface PersistOptional {
  consumables: Record<string, number>;
  unlockedTiers: number[];
  houseOrder: number[];
  inbox: InboxMessage[];
  castAssignment: Record<string, string[]>;
  dailyQuest: DailyQuestDef | null;
  slot: number;
  bonusEarnings: number;
  pendingLoan: PendingLoan | null;
  tasksCompleted: number;
  chitchatBonuses: number;
  premiumResults: HouseResult[];
  pendingInvestment: PendingInvestment | null;
  friendBonds: Record<string, number>;
  ownedInvestmentHouses: OwnedInvestmentHouse[];
  investmentResults: HouseResult[];
  contactedCustomers: ContactedCustomer[];
  activeNewsId: string | null;
  energy: number;
  pendingDeliveries: PendingDelivery[];
  bossMood: number;
  firedSeasonalEventWeeks: number[];
  voiceTally: Record<ToneBucket, number>;
  origin: OriginId | null;
  compassTally: Record<CompassAxis, number>;
  significantMemories: SignificantMemory[];
  originChoiceCount: number;
  selfReflectionShown: boolean;
  unlockedFriendHouseIds: string[];
  friendHouseResults: HouseResult[];
  energyLastRegenAt: number;
  minigameNextAvailableAt: number;
  minigamePlaysRemaining: number;
  ownedSkillIds: string[];
  skillXP: number;
  defeatedRivalIds: string[];
  friendBondCounts: Record<string, number>;
  friendBondMilestonesShown: string[];
  flashbackShown: boolean;
  secondChanceOffered: boolean;
  pendingFriendFavors: Record<string, boolean>;
  friendFavorAccepted: Record<string, boolean>;
  breadthConfrontationShown: boolean;
  firatFullCircleShown: boolean;
  hardTimesUsed: Record<string, boolean>;
  firedFatefulMomentIndices: number[];
  pendingCallbacks: PendingCallback[];
  pausedVisit: PausedVisit | null;
}

type PersistOverrides = PersistRequired & Partial<PersistOptional>;

function App() {
  const [stage, setStage] = useState<Stage>("menu");
  // Settings can be opened from the main menu OR from mid-game — remember where to return to.
  const preSettingsStageRef = useRef<Stage>("menu");
  function openSettings() {
    preSettingsStageRef.current = stage;
    setStage("settings");
  }
  const [questExpanded, setQuestExpanded] = useState(false);
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
  const [showMessagesOnly, setShowMessagesOnly] = useState(false);
  const [messagesInitialThread, setMessagesInitialThread] = useState<string | null>(null);
  const [activeSecretHouseId, setActiveSecretHouseId] = useState<string | null>(null);
  const [radioSecret, setRadioSecret] = useState(false);
  const [sideToast, setSideToast] = useState<string | null>(null);
  const sideQuestsRef = useRef(emptySideQuests());
  const [notificationBanner, setNotificationBanner] = useState<BannerData | null>(null);
  /** S5 — hangi mesajları zaten "gördük" (bildirim tetiklemesin diye); null = bir sonraki gelen kutusunu temel al. */
  const knownMessageIdsRef = useRef<Set<string> | null>(null);
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
  const [rankUpSkillBonus, setRankUpSkillBonus] = useState<number | null>(null);
  const [badgeCelebration, setBadgeCelebration] = useState<Badge[] | null>(null);
  const [dailyRewardPopup, setDailyRewardPopup] = useState<number | null>(null);
  const [starterPromoPopup, setStarterPromoPopup] = useState(false);
  const lastRankRef = useRef<string | null>(null);
  // "Oyun senin gerçek saatini biliyor" — at most once per browser session. See data/realWorldFlavor.ts.
  const realWorldFlavorShownRef = useRef(false);
  const [dailyQuest, setDailyQuest] = useState<DailyQuestDef | null>(null);
  const [dailyQuestResult, setDailyQuestResult] = useState<{ def: DailyQuestDef; completed: boolean } | null>(null);
  const [introFlavorMsg, setIntroFlavorMsg] = useState<PhoneMessage | null>(null);
  const [activeTask, setActiveTask] = useState<WorkTaskDef | null>(null);
  const [lastTaskId, setLastTaskId] = useState<string | undefined>(undefined);
  const [lastQuickCallId, setLastQuickCallId] = useState<string | undefined>(undefined);
  const [lastStagingId, setLastStagingId] = useState<string | undefined>(undefined);
  const [lastSuspiciousDetailId, setLastSuspiciousDetailId] = useState<string | undefined>(undefined);
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
  const [pendingSuspicionDiscount, setPendingSuspicionDiscount] = useState(0);
  const [pendingInterestBonus, setPendingInterestBonus] = useState(0);
  const [pendingFunBonus, setPendingFunBonus] = useState(0);
  const [pendingLuckyCall, setPendingLuckyCall] = useState(false);
  const [shieldHousesLeftState, setShieldHousesLeftState] = useState(getShieldHousesLeft);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [chitchatBonuses, setChitchatBonuses] = useState(0);
  const [premiumResults, setPremiumResults] = useState<HouseResult[]>([]);
  const [activePremiumHouseId, setActivePremiumHouseId] = useState<string | null>(null);
  // "Arkadaş Tavsiyeleri" — friend-house ids unlocked via houseTip accept +
  // their resolved results, persisted. activeFriendHouseId itself (which one
  // is being played right now) is ephemeral, same as activePremiumHouseId.
  const [unlockedFriendHouseIds, setUnlockedFriendHouseIds] = useState<string[]>([]);
  const [friendHouseResults, setFriendHouseResults] = useState<HouseResult[]>([]);
  const [activeFriendHouseId, setActiveFriendHouseId] = useState<string | null>(null);
  // "Emlah'ın Boş Sayfası" — one-time self-reflection moment, gated by the
  // persisted `selfReflectionShown` flag; the active modal itself is ephemeral.
  const [selfReflectionShown, setSelfReflectionShown] = useState(false);
  const [activeSelfReflection, setActiveSelfReflection] = useState<ReflectionKind | null>(null);
  // Kapanış Sekansı — plays once, right before the existing "summary" stats
  // screen. Not persisted: purely a one-shot presentation layer over data
  // App.tsx already computes for that screen.
  const [showEndingSequence, setShowEndingSequence] = useState(false);
  const [pendingCallbackSale, setPendingCallbackSale] = useState<{
    resultIndex: number;
    targetHouse: HouseScene;
    projectedStats: GameStats;
  } | null>(null);
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
  // Fırat Bey'in yüzü — set alongside activeDuelHouseId, purely a richer
  // presentation layer on the same silent bonus mechanic (rivalDuel.ts is
  // untouched). Not persisted, scoped to the one house visit.
  const [activeFiratMood, setActiveFiratMood] = useState<FiratMoodDef | null>(null);
  const [mysteryShopperHouseId, setMysteryShopperHouseId] = useState<string | null>(null);
  const [socialReaction, setSocialReaction] = useState<SocialReaction | null>(null);
  // Canlı Şehir Nabzı — ambient office-radio toast, not persisted. See data/cityPulse.ts.
  const [cityPulseMsg, setCityPulseMsg] = useState<string | null>(null);
  // Enerji Molası — blocks "Bugünün İşini Al" while energy is critically low. Not persisted, purely a gate on the existing energy state.
  const [showEnergyBreak, setShowEnergyBreak] = useState(false);
  // Gates DialogueScene behind the sale-intro doorstep popup (see
  // SaleIntroModal) — reset to false every time `stage` freshly becomes
  // "house" (prevStageRef effect below), so each new house's sale asks for
  // its own confirm tap. Menu music keeps playing while this is false;
  // confirming triggers the menu->sale music crossfade (bkz sound.ts).
  const [saleIntroConfirmed, setSaleIntroConfirmed] = useState(false);
  const prevStageForMusicRef = useRef<Stage | null>(null);
  // Jetton — prestige.ts ile aynı desen: 3 kayıt slotundan bağımsız, hesap genelinde kalıcı.
  const [jettons, setJettonsState] = useState(getJettons);
  const [fullUnlockedState, setFullUnlockedState] = useState(isFullUnlocked);
  // "Yeni Güne Geç" — keyed by house index so it self-resets the moment the
  // player moves to the next house, no explicit reset call needed anywhere.
  const [dayAdvancedForIndex, setDayAdvancedForIndex] = useState<number | null>(null);
  // Rolled fresh every time the player advances (or retries) a day — whether
  // a job even shows up today (see JOB_AVAILABLE_CHANCE in handleAdvanceDay).
  const [jobAvailable, setJobAvailable] = useState(true);
  const [dayActivitiesDone, setDayActivitiesDone] = useState<string[]>([]);
  const dayAdvanced = dayAdvancedForIndex === index;
  useEffect(() => {
    setDayActivitiesDone([]);
  }, [index]);
  useEffect(() => {
    initRevenueCat().then(() => syncPurchasesFromRevenueCat());
    // Game Center girişi kendi penceresini açabiliyor; ATT penceresini yutmasın diye önce izin cevabı beklenir.
    waitForTrackingDecision().then(() => initGameCenter());
    const dailyAmount = navigator.webdriver ? null : claimDailyRewardIfEligible();
    if (dailyAmount !== null) {
      addJettons(dailyAmount);
      setJettonsState(getJettons());
      setDailyRewardPopup(dailyAmount);
    }
  }, []);
  // Music deliberately does NOT auto-start on app mount (menu/splash should
  // be silent) — it's started explicitly from startNewGame()/continueSaved()
  // instead, right as the player actually enters the game screen. That call
  // also happens to ride along on the same click/tap that triggered it, so
  // it naturally satisfies the browser/WKWebView autoplay policy without
  // needing a separate pointerdown-kick fallback.
  // Real wall-clock energy timers — device time, not the in-game calendar. See data/energy.ts.
  const [energyLastRegenAt, setEnergyLastRegenAt] = useState(() => Date.now());
  const [minigameNextAvailableAt, setMinigameNextAvailableAt] = useState(() => Date.now());
  // Vestigial — mini-games no longer gate on a real-time cooldown (see
  // data/energy.ts), these two fields just stay around unused so old
  // saves' shape doesn't need a version bump for two harmless dead numbers.
  const [minigamePlaysRemaining, setMinigamePlaysRemaining] = useState(2);
  // "Emlah'ın İç Sesi" — skill tree, paid for with a separate XP currency. See data/skillTree.ts.
  const [ownedSkillIds, setOwnedSkillIds] = useState<string[]>([]);
  const [skillXP, setSkillXP] = useState(0);
  // "Şehrin Kurtları" — rival ladder, Fırat Bey is just the first rung now. See data/rivalLadder.ts.
  const [defeatedRivalIds, setDefeatedRivalIds] = useState<string[]>([]);
  // Sosyal Bağ — silent per-friend counters, easter egg only, no gameplay effect. See data/friendBondMilestones.ts.
  const [friendBondCounts, setFriendBondCounts] = useState<Record<string, number>>({});
  const [friendBondMilestonesShown, setFriendBondMilestonesShown] = useState<string[]>([]);
  // "Zaman Yolcusu Emlah" — one-time flashback easter egg. activeFlashback itself is ephemeral. See data/timeTravelerFlashback.ts.
  const [flashbackShown, setFlashbackShown] = useState(false);
  const [activeFlashback, setActiveFlashback] = useState<SignificantMemory | null>(null);
  // "İkinci Şans" — one-time surprise lost-customer callback. See data/secondChanceEvent.ts.
  const [secondChanceOffered, setSecondChanceOffered] = useState(false);
  // "Satış Sonrası Arama" — no persisted state, same "avoid immediate repeat" pattern as lastTaskId. See data/postSaleCall.ts.
  const [activePostSaleCall, setActivePostSaleCall] = useState<{ def: PostSaleCallDef; contactName: string; houseId: string } | null>(null);
  const [lastPostSaleCallId, setLastPostSaleCallId] = useState<string | undefined>(undefined);
  // "İlişki Evreleri" — see data/relationshipStages.ts.
  const [pendingFriendFavors, setPendingFriendFavors] = useState<Record<string, boolean>>({});
  const [friendFavorAccepted, setFriendFavorAccepted] = useState<Record<string, boolean>>({});
  const [breadthConfrontationShown, setBreadthConfrontationShown] = useState(false);
  // "Tam Çember" — one-time Fırat Bey closure once the full rival ladder is cleared. See data/rivalCharacter.ts.
  const [firatFullCircleShown, setFiratFullCircleShown] = useState(false);
  // "Zor Zamanlar" — friend id -> already used. See data/relationshipStages.ts.
  const [hardTimesUsed, setHardTimesUsed] = useState<Record<string, boolean>>({});
  // "Kader Anları" — one-time, origin-specific beats at fixed house indices. See data/fatefulMoments.ts.
  const [firedFatefulMomentIndices, setFiredFatefulMomentIndices] = useState<number[]>([]);
  const [activeFatefulMoment, setActiveFatefulMoment] = useState<{ title: string; paragraphs: string[] } | null>(null);
  const [clickMilestoneMsg, setClickMilestoneMsg] = useState<string | null>(null);
  // Gizli Dokunuş Menüsü — 5 taps on the office title within a few seconds
  // opens a hidden lifetime-stats screen (the iOS-native stand-in for the
  // console easter egg, which no normal player can reach in a wrapped app).
  const [showSecretStats, setShowSecretStats] = useState(false);
  const [easterEggsSeenCount, setEasterEggsSeenCount] = useState(0);
  const [pressureChoicesTaken, setPressureChoicesTaken] = useState(0);
  // "Pazarlık Ustası" achievement — held-firm picks tallied within the current week, reset on week change.
  const heldFirmWeekRef = useRef({ weekIndex: -1, count: 0 });
  const officeTapCountRef = useRef(0);
  const officeTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Nadir, house-agnostic flavor moment — see data/easterEggs.ts. Same
  // one-house-visit scope as the flavor systems above, not persisted.
  const [activeEasterEgg, setActiveEasterEgg] = useState<{ houseId: string; egg: EasterEgg } | null>(null);
  const [lastEasterEggId, setLastEasterEggId] = useState<string | undefined>(undefined);
  // Emlah'ın Enerjisi — persisted (it's a real resource the player manages
  // across the whole game, unlike the four flavor systems above).
  const [energy, setEnergy] = useState(ENERGY_MAX);
  // Emlah'ın Takvimi — deferred sale payments waiting on their contract's
  // negotiated delivery date. See data/calendar.ts.
  const [pendingDeliveries, setPendingDeliveries] = useState<PendingDelivery[]>([]);
  const [pendingCallbacks, setPendingCallbacks] = useState<PendingCallback[]>([]);
  // "Evi Gez / Ofise Dön" — today's offered visit, deferred instead of entered
  // immediately. At most one at a time (see PausedVisit's doc comment).
  const [pausedVisit, setPausedVisit] = useState<PausedVisit | null>(null);
  // Ephemeral (never persisted) — the customer's counter-offer while the
  // player is deciding accept/decline from the İşler panel.
  const [pausedVisitOffer, setPausedVisitOffer] = useState<{ daysOffset: number } | null>(null);
  const [showIsler, setShowIsler] = useState(false);
  // Telefon şarjı — purely cosmetic flavor, not persisted. See data/battery.ts.
  const [phoneBattery, setPhoneBattery] = useState(BATTERY_MAX);
  // Patron Memnuniyeti — Muzaffer Bey's mood, persisted. See data/bossMood.ts.
  const [bossMood, setBossMood] = useState(BOSS_MOOD_START);
  // Güncel Olaylar — weekIndex values whose scripted event already fired. See data/seasonalEvents.ts.
  const [firedSeasonalEventWeeks, setFiredSeasonalEventWeeks] = useState<number[]>([]);
  // Efsane Modu — Yeni Oyun+, lives outside SaveGame entirely. See data/prestige.ts.
  const [prestigeTitleThisRun, setPrestigeTitleThisRun] = useState<string | null>(null);
  // Emlah'ın Sesi — running tally of picked-choice tones. See data/voiceTone.ts.
  const [voiceTally, setVoiceTally] = useState<Record<ToneBucket, number>>({ eglenceli: 0, samimi: 0, atilgan: 0 });
  // Emlah'ın Geçmişi — one-time backstory pick at game start. See data/origin.ts.
  const [origin, setOrigin] = useState<OriginId | null>(null);
  // Değerler Pusulası — running tally of picked-choice honesty leanings. See data/valuesCompass.ts.
  const [compassTally, setCompassTally] = useState<Record<CompassAxis, number>>({ durustluk: 0, kurnazlik: 0 });
  // Karar Anıları — capped store of defining moments, referenced later by unrelated customers. See data/significantMemory.ts.
  const [significantMemories, setSignificantMemories] = useState<SignificantMemory[]>([]);
  const [activeMemoryReference, setActiveMemoryReference] = useState<{ houseId: string; memory: SignificantMemory } | null>(null);
  // Sadakat Rozetleri — lifetime count of the origin closing choice being picked. See data/origin.ts.
  const [originChoiceCount, setOriginChoiceCount] = useState(0);
  // Pacing fix — true only for the one transition right after an office-task-family
  // screen resolved; not persisted, purely a same-transition guard for afterIntro().
  const [hadWorkTaskThisTransition, setHadWorkTaskThisTransition] = useState(false);
  // The "phone" stage is the hub landed on between houses/callbacks. Instead
  // of always showing the message thread immediately, it now shows the
  // office first — this flag reveals the phone/message screen on top of it
  // once the player deliberately asks for today's job. Reset below whenever
  // a fresh landing on "phone" happens, so the office is always seen first.
  const [showPhoneOverlay, setShowPhoneOverlay] = useState(false);
  useEffect(() => {
    if (stage === "phone") setShowPhoneOverlay(false);
  }, [stage]);
  // Ölçüm — her olaya hangi ekranda / kaçıncı evde olunduğu eklenir (app_background'da "nerede bıraktı").
  useEffect(() => {
    setAnalyticsContext({ stage, houseNo: index + 1, paid: isFullUnlocked() ? "full" : "free", origin: origin ?? "" });
    if (stage === "store") track("store_open", { from: storeReturnStageRef.current });
  }, [stage, index, origin]);
  // Açık aktivite mini oyunu (Vitrin Karesi / Tapu Masası) ve bu oyunda bulunan "unutulmuş dosya"nın sonuç indeksi.
  const [activeActivityGame, setActiveActivityGame] = useState<string | null>(null);
  const forgottenFileRef = useRef<number | null>(null);
  const [resumeRequest, setResumeRequest] = useState<{ savedGame: SaveGame; catchUpRegenAt: number } | null>(null);
  // Kapıdan "Vazgeç" için: son eve girişte gerçekten harcanan enerji ve bu ziyaretin erteleme durumu.
  const lastHouseEnergyCostRef = useRef(0);
  const activeVisitMetaRef = useRef<{ postponed?: boolean; penaltyApplied?: boolean }>({});
  // Mağaza kilit ekranından (jeton yetmeyince) açıldıysa "Geri" oraya döner.
  const storeReturnStageRef = useRef<Stage>("settings");
  /** Mağaza'yı oyunun içinden (jeton çipi / alt çubuk) açar; geri dönüş bulunduğun ekrana. */
  function openStoreFromGame() {
    storeReturnStageRef.current = stage;
    setStage("store");
  }
  // Pasif enerji dolumu ev geçişlerinde hesaplanıyordu; enerjisi iş eşiğinin
  // altında ofiste kalan oyuncu ev geçişi yapamadığı için saatlerce beklese de
  // enerji hiç dolmuyordu (kilit). Ofisteyken dakikada bir ve uygulamaya
  // geri dönüldüğünde de aynı gerçek-saat hesabını uygula.
  useEffect(() => {
    if (stage !== "phone") return;
    function catchUp() {
      const { gained, newLastRegenAt } = computePassiveEnergyRegen(energyLastRegenAt, Date.now());
      if (gained <= 0) return;
      setEnergy((e) => Math.min(ENERGY_MAX, e + gained));
      setEnergyLastRegenAt(newLastRegenAt);
    }
    catchUp();
    const timer = setInterval(catchUp, 60 * 1000);
    document.addEventListener("visibilitychange", catchUp);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", catchUp);
    };
  }, [stage, energyLastRegenAt]);
  // Otomasyon/test ortamında (Playwright, navigator.webdriver) splash'ı atla — gerçek kullanıcıda hep gösterilir.
  const [showSplash, setShowSplash] = useState(() => !navigator.webdriver);
  // Dil seçim ekranı her açılışta splash'ın hemen ardından gelir (son seçim
  // vurgulu) — eskiden sadece ilk kurulumda çıkıyordu, güncelleme alan
  // TestFlight kullanıcıları onu hiç görmüyordu. Otomasyonda eski davranış
  // korunur ki testler her reload'da bu ekrana takılmasın.
  const [languageChosen, setLanguageChosen] = useState(() => navigator.webdriver && hasChosenLanguage());
  const [language, setLanguage] = useState<Language>(getLanguage);

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
    if (!cityPulseMsg) return;
    const t = setTimeout(() => setCityPulseMsg(null), 6500);
    return () => clearTimeout(t);
  }, [cityPulseMsg]);

  // "Sen gerçekten çok tıklıyorsun ha" — counts every click anywhere in the
  // app, lifetime, across all playthroughs. See data/clickCounter.ts.
  useEffect(() => {
    function handleGlobalClick() {
      const milestone = recordClick();
      if (milestone !== null) {
        setClickMilestoneMsg(milestoneMessage(milestone));
        sq.album("tiklama");
        triggerHaptic("light");
      }
    }
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  useEffect(() => {
    if (!clickMilestoneMsg) return;
    const t = setTimeout(() => setClickMilestoneMsg(null), 4200);
    return () => clearTimeout(t);
  }, [clickMilestoneMsg]);

  useEffect(() => {
    setSavedGames(loadAllSaves());
    printConsoleEasterEgg();
  }, []);

  const house = allHouses[houseOrder[index] ?? index];
  const intro = house ? (houseIntros[house.id] ?? defaultIntro(house)) : null;
  const isLastHouse = index === allHouses.length - 1;
  const lastResult = results[results.length - 1];
  const maxUnlockedTier = Math.max(...unlockedTiers);

  function persist(p: PersistOverrides) {
    const save: SaveGame = {
      version: 26,
      index: p.index,
      houseOrder: p.houseOrder ?? houseOrder,
      results: p.results,
      weekOutcomes: p.weekOutcomes,
      badges: p.badges,
      ownedPerks: p.ownedPerks,
      consumables: p.consumables ?? consumables,
      unlockedTiers: p.unlockedTiers ?? unlockedTiers,
      spent: p.spent,
      inbox: p.inbox ?? inbox,
      castAssignment: p.castAssignment ?? castAssignment,
      dailyQuest: p.dailyQuest ?? dailyQuest,
      bonusEarnings: p.bonusEarnings ?? bonusEarnings,
      pendingLoan: p.pendingLoan ?? pendingLoan,
      tasksCompleted: p.tasksCompleted ?? tasksCompleted,
      chitchatBonuses: p.chitchatBonuses ?? chitchatBonuses,
      premiumResults: p.premiumResults ?? premiumResults,
      pendingInvestment: p.pendingInvestment ?? pendingInvestment,
      friendBonds: p.friendBonds ?? friendBonds,
      ownedInvestmentHouses: p.ownedInvestmentHouses ?? ownedInvestmentHouses,
      investmentResults: p.investmentResults ?? investmentResults,
      contactedCustomers: p.contactedCustomers ?? contactedCustomers,
      activeNewsId: p.activeNewsId ?? activeNewsId,
      energy: p.energy ?? energy,
      pendingDeliveries: p.pendingDeliveries ?? pendingDeliveries,
      pendingCallbacks: p.pendingCallbacks ?? pendingCallbacks,
      pausedVisit: p.pausedVisit !== undefined ? p.pausedVisit : pausedVisit,
      bossMood: p.bossMood ?? bossMood,
      firedSeasonalEventWeeks: p.firedSeasonalEventWeeks ?? firedSeasonalEventWeeks,
      voiceTally: p.voiceTally ?? voiceTally,
      origin: p.origin ?? origin,
      compassTally: p.compassTally ?? compassTally,
      significantMemories: p.significantMemories ?? significantMemories,
      originChoiceCount: p.originChoiceCount ?? originChoiceCount,
      selfReflectionShown: p.selfReflectionShown ?? selfReflectionShown,
      unlockedFriendHouseIds: p.unlockedFriendHouseIds ?? unlockedFriendHouseIds,
      friendHouseResults: p.friendHouseResults ?? friendHouseResults,
      energyLastRegenAt: p.energyLastRegenAt ?? energyLastRegenAt,
      minigameNextAvailableAt: p.minigameNextAvailableAt ?? minigameNextAvailableAt,
      minigamePlaysRemaining: p.minigamePlaysRemaining ?? minigamePlaysRemaining,
      ownedSkillIds: p.ownedSkillIds ?? ownedSkillIds,
      skillXP: p.skillXP ?? skillXP,
      defeatedRivalIds: p.defeatedRivalIds ?? defeatedRivalIds,
      friendBondCounts: p.friendBondCounts ?? friendBondCounts,
      friendBondMilestonesShown: p.friendBondMilestonesShown ?? friendBondMilestonesShown,
      flashbackShown: p.flashbackShown ?? flashbackShown,
      secondChanceOffered: p.secondChanceOffered ?? secondChanceOffered,
      pendingFriendFavors: p.pendingFriendFavors ?? pendingFriendFavors,
      friendFavorAccepted: p.friendFavorAccepted ?? friendFavorAccepted,
      breadthConfrontationShown: p.breadthConfrontationShown ?? breadthConfrontationShown,
      firatFullCircleShown: p.firatFullCircleShown ?? firatFullCircleShown,
      hardTimesUsed: p.hardTimesUsed ?? hardTimesUsed,
      firedFatefulMomentIndices: p.firedFatefulMomentIndices ?? firedFatefulMomentIndices,
      sideQuests: sideQuestsRef.current,
      savedAt: new Date().toISOString(),
    };
    const targetSlot = p.slot ?? activeSlot;
    writeSave(save, targetSlot);
    setSavedGames((prev) => prev.map((s, i) => (i === targetSlot ? save : s)));
    setLastSavedAt(Date.now());
  }

  function openEmlahMenu(tab: EmlahTab = "market") {
    setEmlahMenuTab(tab);
    setShowEmlahMenu(true);
  }

  /** Messages get their own dedicated, phone-only view (not the full tabbed Emlah menu) — see OfficeScene's Messages button. */
  function openMessagesOnly(threadId: string | null = null) {
    setMessagesInitialThread(threadId);
    setShowMessagesOnly(true);
    drainPhoneBattery();
  }

  /** Bir sohbet açıldığında (veya telefonda canlı görüldüğünde) okundu işaretle — hem state'te hem kayıtta. */
  function markThreadAsRead(threadId: string) {
    setInbox((prev) => markThreadRead(prev, threadId));
    markSavedThreadRead(activeSlot, threadId);
  }

  // Telefon şarjı — rolled every time a phone-style screen is opened; see data/battery.ts.
  function drainPhoneBattery() {
    setPhoneBattery((b) => maybeDrainBattery(b));
  }

  // Appends the "şarjım bitiyor" flavor option once the battery is low — never changes stats, see data/battery.ts.
  function withLowBatteryChoice(
    choices: { id: string; text: string }[] | undefined,
  ): { id: string; text: string }[] | undefined {
    if (!choices || choices.length === 0) return choices;
    if (phoneBattery > BATTERY_LOW_THRESHOLD) return choices;
    return [
      ...choices,
      { id: LOW_BATTERY_CHOICE_ID, text: t({ tr: "Şarjım bitiyor, kısa keseyim...", en: "My battery's dying, let me keep this short..." }) },
    ];
  }

  function handleLineChosen(text: string, fun: number) {
    setBestLineThisHouse((prev) => (prev && prev.fun >= fun ? prev : { text, fun }));
  }

  function applyEffects(effects: ChoiceEffects) {
    const energyFactor = energy < ENERGY_LOW_THRESHOLD ? ENERGY_LOW_SUSPICION_MULTIPLIER : 1;
    const suspicionFactor =
      suspicionGainFactor(ownedPerks) * difficultyMultiplier[getDifficulty()] * energyFactor * skillSuspicionFactor(ownedSkillIds);
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

  // "Pazarlık Ustası" achievement — 5 held-firm picks within the same week.
  function handleHeldFirm() {
    const weekIdx = weekIndexForHouse(index);
    const tracker = heldFirmWeekRef.current;
    tracker.count = tracker.weekIndex === weekIdx ? tracker.count + 1 : 1;
    tracker.weekIndex = weekIdx;
    if (tracker.count >= 5) unlockAchievement(ACHIEVEMENT_IDS.heldFirm5InWeek);
  }

  // "Emlah'ın Sesi" — classifies and tallies every picked choice's tone.
  // Not persisted per-choice (same as stats themselves); it rides along
  // with whatever persist() call naturally follows house completion.
  function handleToneChoice(effects: ChoiceEffects) {
    const tone = classifyChoiceTone(effects);
    if (tone) setVoiceTally((prev) => ({ ...prev, [tone]: prev[tone] + 1 }));
    const compassAxis = classifyCompassChoice(effects);
    if (compassAxis) {
      setCompassTally((prev) => {
        const next = { ...prev, [compassAxis]: prev[compassAxis] + 1 };
        if (!selfReflectionShown) {
          const kind = checkSelfReflectionTrigger(next);
          if (kind) {
            setActiveSelfReflection(kind);
            setSelfReflectionShown(true);
          }
        }
        return next;
      });
    }
  }

  // Sadakat Rozetleri — fires a one-time celebratory message exactly when
  // the count crosses LOYALTY_THRESHOLD; from then on the origin's nickname
  // shows up in the weekly boss-mood messages (see finalizeResult).
  function handleOriginChoicePicked() {
    setOriginChoiceCount((prev) => {
      const next = prev + 1;
      if (next === LOYALTY_THRESHOLD) {
        const def = originById(origin);
        if (def) {
          setInbox((inb) =>
            logMessages(
              inb, "muzaffer", "Muzaffer Bey",
              [{ from: "Muzaffer Bey", text: `Artık sana "${resolveText(def.nickname)}" diyeceğim, bu tarzını hak ettin.` }],
              index + 1,
            ),
          );
        }
      }
      return next;
    });
  }

  // Gizli Dokunuş Menüsü — 5 taps within 3 seconds on the office title.
  const OFFICE_TAP_TARGET = 5;
  const OFFICE_TAP_WINDOW_MS = 3000;
  function handleOfficeTitleTap() {
    officeTapCountRef.current += 1;
    if (officeTapTimerRef.current) clearTimeout(officeTapTimerRef.current);
    if (officeTapCountRef.current >= OFFICE_TAP_TARGET) {
      officeTapCountRef.current = 0;
      setShowSecretStats(true);
      triggerHaptic("success");
      return;
    }
    officeTapTimerRef.current = setTimeout(() => {
      officeTapCountRef.current = 0;
    }, OFFICE_TAP_WINDOW_MS);
  }

  function handleFlirt(characterId: string, _characterName: string) {
    const newFriendBonds = { ...friendBonds, [characterId]: (friendBonds[characterId] ?? 0) + FLIRT_BOND_GAIN };
    setFriendBonds(newFriendBonds);
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds: newFriendBonds });
  }

  // "İkram Et" — which consumable stock (if any) DialogueScene can offer to
  // this house's customer. Prefers kahve (richer treat) when both are owned.
  const ikramKind: "seker" | "kahve" | null =
    (consumables["kahve-ikrami"] ?? 0) > 0 ? "kahve" : (consumables["seker-ikrami"] ?? 0) > 0 ? "seker" : null;

  function handleIkramUsed() {
    if (!ikramKind) return;
    const id = ikramKind === "kahve" ? "kahve-ikrami" : "seker-ikrami";
    const newConsumables = { ...consumables, [id]: Math.max(0, (consumables[id] ?? 0) - 1) };
    setConsumables(newConsumables);
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables: newConsumables });
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
    // Explicit overrides so a brand-new game's very first save (persisted
    // synchronously inside proceedToHouseIntro, before this render's state
    // updates have committed) can't read stale pre-reset closure values —
    // same stale-closure class of bug fixed elsewhere in this file, just
    // caught proactively here since startNewGame() resets all three right
    // before this call chain runs.
    originParam: OriginId | null = origin,
    voiceTallyParam: Record<ToneBucket, number> = voiceTally,
    compassTallyParam: Record<CompassAxis, number> = compassTally,
    significantMemoriesParam: SignificantMemory[] = significantMemories,
    originChoiceCountParam: number = originChoiceCount,
    // Same explicit-override reasoning as above, extended to every field
    // added since — continueSaved() passes the freshly-loaded save's
    // values here so the synchronous persist() inside proceedToHouseIntro
    // can't read stale pre-restore closure state.
    selfReflectionShownParam: boolean = selfReflectionShown,
    unlockedFriendHouseIdsParam: string[] = unlockedFriendHouseIds,
    friendHouseResultsParam: HouseResult[] = friendHouseResults,
    energyLastRegenAtParam: number = energyLastRegenAt,
    minigameNextAvailableAtParam: number = minigameNextAvailableAt,
    minigamePlaysRemainingParam: number = minigamePlaysRemaining,
    ownedSkillIdsParam: string[] = ownedSkillIds,
    skillXPParam: number = skillXP,
    defeatedRivalIdsParam: string[] = defeatedRivalIds,
    friendBondCountsParam: Record<string, number> = friendBondCounts,
    friendBondMilestonesShownParam: string[] = friendBondMilestonesShown,
    flashbackShownParam: boolean = flashbackShown,
    secondChanceOfferedParam: boolean = secondChanceOffered,
    firedFatefulMomentIndicesParam: number[] = firedFatefulMomentIndices,
  ) {
    const nextHouse = allHouses[order[newIndex] ?? newIndex];
    loadHouseImage(nextHouse.id);

    // Real-clock passive energy drip — checked on every house transition
    // rather than a background timer, so it costs nothing while idle but
    // still feels "always running" during actual play. See data/energy.ts.
    const { gained: regenGained, newLastRegenAt: regenAt } = computePassiveEnergyRegen(energyLastRegenAt, Date.now());
    if (regenGained > 0) {
      setEnergy((e) => Math.min(ENERGY_MAX, e + regenGained));
      setEnergyLastRegenAt(regenAt);
    }

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
      // just which mini-game fills it, for variety. Staging/Şüpheli Detay
      // reuse WorkTaskScreen (stage "task") exactly like office chores,
      // just with different content pools. "Satış Sonrası Arama" only
      // joins the rotation when a sold house actually exists to call about.
      const postSaleCandidateIdx =
        newIndex >= POST_SALE_CALL_MIN_INDEX ? pickPostSaleCallCandidateIndex(currentResults) : null;
      const pickPoolSize = postSaleCandidateIdx !== null ? 5 : 4;
      const pick = Math.floor(Math.random() * pickPoolSize);
      if (pick === 0) {
        const task = pickWorkTask(lastTaskId);
        setLastTaskId(task.id);
        setActiveTask(task);
        setStage("task");
      } else if (pick === 1) {
        const quickCall = pickQuickCall(lastQuickCallId);
        setLastQuickCallId(quickCall.id);
        setActiveTask(quickCall);
        setStage("quickcall");
      } else if (pick === 2) {
        const staging = pickStagingTask(lastStagingId);
        setLastStagingId(staging.id);
        setActiveTask(staging);
        setStage("task");
      } else if (pick === 3) {
        const detail = pickSuspiciousDetail(lastSuspiciousDetailId);
        setLastSuspiciousDetailId(detail.id);
        setActiveTask(detail);
        setStage("task");
      } else {
        const call = pickPostSaleCall(lastPostSaleCallId);
        setLastPostSaleCallId(call.id);
        const targetHouse = allHouses.find((h) => h.id === currentResults[postSaleCandidateIdx!].houseId)!;
        const contactName = resolveCustomerNames(targetHouse, castAssignmentParam)[0];
        setActivePostSaleCall({ def: call, contactName, houseId: targetHouse.id });
        setStage("postsalecall");
      }
      return;
    }

    proceedToHouseIntro(
      newIndex, currentResults, perksList, consumablesList, tiersList, order, inboxList, castAssignmentParam,
      dailyQuestParam, null, false, originParam, voiceTallyParam, compassTallyParam,
      significantMemoriesParam, originChoiceCountParam, selfReflectionShownParam, unlockedFriendHouseIdsParam,
      friendHouseResultsParam, energyLastRegenAtParam, minigameNextAvailableAtParam, minigamePlaysRemainingParam,
      ownedSkillIdsParam, skillXPParam, defeatedRivalIdsParam, friendBondCountsParam, friendBondMilestonesShownParam,
      flashbackShownParam, secondChanceOfferedParam, firedFatefulMomentIndicesParam,
    );
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
    // True only when this call is arriving right after an office-task-family
    // screen (task/quickcall/staging/suspicious detail) resolved — lets
    // afterIntro() skip the friend/chitchat roll for just this one
    // transition, so the two detour families can never stack. See
    // WORK_TASK_CHANCE's comment above for the full reasoning.
    cameFromWorkTask: boolean = false,
    originParam: OriginId | null = origin,
    voiceTallyParam: Record<ToneBucket, number> = voiceTally,
    compassTallyParam: Record<CompassAxis, number> = compassTally,
    significantMemoriesParam: SignificantMemory[] = significantMemories,
    originChoiceCountParam: number = originChoiceCount,
    selfReflectionShownParam: boolean = selfReflectionShown,
    unlockedFriendHouseIdsParam: string[] = unlockedFriendHouseIds,
    friendHouseResultsParam: HouseResult[] = friendHouseResults,
    energyLastRegenAtParam: number = energyLastRegenAt,
    minigameNextAvailableAtParam: number = minigameNextAvailableAt,
    minigamePlaysRemainingParam: number = minigamePlaysRemaining,
    ownedSkillIdsParam: string[] = ownedSkillIds,
    skillXPParam: number = skillXP,
    defeatedRivalIdsParam: string[] = defeatedRivalIds,
    friendBondCountsParam: Record<string, number> = friendBondCounts,
    friendBondMilestonesShownParam: string[] = friendBondMilestonesShown,
    flashbackShownParam: boolean = flashbackShown,
    secondChanceOfferedParam: boolean = secondChanceOffered,
    firedFatefulMomentIndicesParam: number[] = firedFatefulMomentIndices,
  ) {
    const nextHouse = allHouses[order[newIndex] ?? newIndex];

    // See cameFromWorkTask's doc comment above — read by afterIntro() once
    // the player clicks through this house's intro messages.
    setHadWorkTaskThisTransition(cameFromWorkTask);

    // Telefon şarjı — a new house is a new day, so the phone got charged overnight.
    setPhoneBattery(BATTERY_MAX);

    // Resolve any loan to Bora that's come due before anything else this visit.
    let newBonusEarnings = bonusEarnings;
    let loanInbox = inboxList;
    if (pendingLoan && newIndex >= pendingLoan.dueIndex) {
      const repaid = Math.random() < LOAN_REPAY_CHANCE;
      const loanMsg: PhoneMessage = repaid
        ? {
            from: "Bora",
            text: t({
              tr: `Borcunu ödüyorum kanka, sağ ol beklettiğim için! (+${formatTL(pendingLoan.amount)})`,
              en: `Paying you back, man, thanks for waiting! (+${formatTL(pendingLoan.amount)})`,
            }),
          }
        : {
            from: "Bora",
            text: t({
              tr: "Kanka çok mahcubum ama şu an gerçekten elimden bir şey gelmiyor, borcunu şimdilik ödeyemeyeceğim...",
              en: "Man, I'm really embarrassed, but I've got nothing right now, I can't pay you back just yet...",
            }),
          };
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
        ? {
            from: "Bora",
            text: t({
              tr: `O daireyi hatırlıyor musun, satıldı! Payına düşen +${formatTL(INVESTMENT_PROFIT_AMOUNT)}`,
              en: `Remember that flat? It sold! Your cut is +${formatTL(INVESTMENT_PROFIT_AMOUNT)}`,
            }),
          }
        : {
            from: "Bora",
            text: t({
              tr: `O daire konusunda kötü haberim var, beklediğimiz gibi gitmedi. Elimize sadece ${formatTL(INVESTMENT_LOSS_AMOUNT)} geçti.`,
              en: `Bad news about that flat, it didn't go the way we hoped. We only cleared ${formatTL(INVESTMENT_LOSS_AMOUNT)}.`,
            }),
          };
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
          [
            {
              from: "Muzaffer Bey",
              text: t({
                tr: `${d.houseTitle} teslimi tamamlandı, bekleyen ödeme hesabına geçti: +${formatTL(d.deferredAmount)}`,
                en: `${d.houseTitle} delivery completed, the pending payment landed in your account: +${formatTL(d.deferredAmount)}`,
              }),
            },
          ],
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

    // Güncel Olaylar — a handful of scripted, date-anchored beats (see
    // seasonalEvents.ts). Fires at most once per weekIndex, guarded by
    // firedSeasonalEventWeeks so a locked-gate retry can't double-pay it.
    let newFiredSeasonalEventWeeks = firedSeasonalEventWeeks;
    if (newIndex % HOUSES_PER_WEEK === 0) {
      const weekIdx = weekIndexForHouse(newIndex);
      const event = seasonalEventForWeek(weekIdx);
      if (event && !firedSeasonalEventWeeks.includes(weekIdx)) {
        newBonusEarnings += event.bonusEarnings;
        setBonusEarnings(newBonusEarnings);
        loanInbox = logMessages(
          loanInbox, "muzaffer", "Muzaffer Bey",
          [{ from: "Muzaffer Bey", text: `${formatGameDate(gameDateForIndex(newIndex))} — ${resolveText(event.headline)}${event.bonusEarnings !== 0 ? ` (${event.bonusEarnings > 0 ? "+" : ""}${formatTL(event.bonusEarnings)})` : ""}` }],
          newIndex + 1,
        );
        newFiredSeasonalEventWeeks = [...firedSeasonalEventWeeks, weekIdx];
        setFiredSeasonalEventWeeks(newFiredSeasonalEventWeeks);
      }
    }

    const positionInWeek = newIndex % HOUSES_PER_WEEK;
    let newStats = computeFreshStats(positionInWeek, perksList, consumablesList);
    const nextDistrict = districtOf(nextHouse.location);
    // Bölge Hakimiyeti — same additive-nudge shape as districtReputationOffset right
    // beside it; dominance itself is purely derived from `currentResults`, no new state.
    const dominanceDiscount = isDistrictDominated(currentResults, allHouses, nextDistrict)
      ? DISTRICT_DOMINANCE_SUSPICION_DISCOUNT
      : 0;
    newStats = {
      ...newStats,
      suspicion: Math.max(
        0,
        newStats.suspicion +
          reputationSuspicionOffset(currentResults) +
          districtReputationOffset(currentResults, allHouses, nextDistrict) +
          dominanceDiscount,
      ),
    };
    // "Emlah'ın İç Sesi" — skill tree's flat starting-stat nudges, same shape as the prestige bonus already baked into computeFreshStats.
    const skillBonus = startingBonusForSkills(ownedSkillIds);
    if (skillBonus.fun > 0 || skillBonus.interest > 0) {
      newStats = {
        ...newStats,
        fun: Math.min(100, newStats.fun + skillBonus.fun),
        interest: Math.min(100, newStats.interest + skillBonus.interest),
      };
    }
    // Kişisel puan (kariyer rütbesi) yükseldikçe küçük bir satış şansı nudge'ı — same additive shape as the prestige/skill bonuses above.
    const rankInterest = rankInterestBonus(earned);
    if (rankInterest > 0) {
      newStats = { ...newStats, interest: Math.min(100, newStats.interest + rankInterest) };
    }
    // "Arkadaş Desteği" — the first system that actually feeds İlişki
    // Evreleri BACK into the live sales loop instead of running in
    // parallel to it: a Yakınlık-stage friend occasionally gives real,
    // if small, help before a visit. Same silent additive-nudge shape as
    // the skill/prestige/rank bonuses right above it (see the Arkadaşların
    // section in RelationshipsPanel for the one place this is explained
    // to the player, same as skill/prestige bonuses never get a per-house
    // announcement either).
    const yakinlikFriendIds = friendCharacters.filter((f) => (friendBondCounts[f.id] ?? 0) >= 10);
    if (yakinlikFriendIds.length > 0 && Math.random() < FRIEND_ASSIST_CHANCE) {
      newStats = {
        ...newStats,
        interest: Math.min(100, newStats.interest + FRIEND_ASSIST_INTEREST_BONUS),
        suspicion: Math.max(0, newStats.suspicion - FRIEND_ASSIST_SUSPICION_DISCOUNT),
      };
    }

    // "Zaman Yolcusu Emlah" — rare, one-time-per-run easter egg, purely a modal shown between houses. No stats/results are touched by it.
    if (!flashbackShown && newIndex >= FLASHBACK_MIN_INDEX && significantMemories.length > 0 && Math.random() < FLASHBACK_CHANCE) {
      const memory = pickFlashbackMemory(significantMemories);
      if (memory) {
        setActiveFlashback(memory);
        sq.album("zaman-yolcusu");
        setFlashbackShown(true);
      }
    }
    // "Kader Anları" — guaranteed (not a random roll), origin-specific,
    // one-time-per-index beats at 3 fixed points across the run. Reads
    // from the explicit Param override (not the bare closure) for the
    // exact same stale-closure reason flashbackShownParam etc. do —
    // continueSaved's very first synchronous transition must see the
    // freshly-restored list, not a pre-restore default.
    let newFiredFatefulMomentIndices = firedFatefulMomentIndicesParam;
    if (originParam && FATEFUL_MOMENT_INDICES.includes(newIndex as (typeof FATEFUL_MOMENT_INDICES)[number]) && !firedFatefulMomentIndicesParam.includes(newIndex)) {
      const moment = fatefulMomentFor(newIndex, originParam);
      if (moment) {
        setActiveFatefulMoment({ title: resolveText(moment.title), paragraphs: moment.paragraphs.map((p) => resolveText(p)) });
        newFiredFatefulMomentIndices = [...firedFatefulMomentIndicesParam, newIndex];
        setFiredFatefulMomentIndices(newFiredFatefulMomentIndices);
      }
    }
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
    if (pendingSuspicionDiscount > 0) {
      newStats = { ...newStats, suspicion: Math.max(0, newStats.suspicion - pendingSuspicionDiscount) };
      setPendingSuspicionDiscount(0);
    }
    if (pendingInterestBonus > 0) {
      newStats = { ...newStats, interest: Math.min(100, newStats.interest + pendingInterestBonus) };
      setPendingInterestBonus(0);
    }
    if (pendingFunBonus > 0) {
      newStats = { ...newStats, fun: Math.min(100, newStats.fun + pendingFunBonus) };
      setPendingFunBonus(0);
    }
    const shieldLeft = getShieldHousesLeft();
    if (shieldLeft > 0) {
      newStats = { ...newStats, suspicion: Math.max(0, newStats.suspicion - SUSPICION_SHIELD_DISCOUNT) };
      setShieldHousesLeft(shieldLeft - 1);
      setShieldHousesLeftState(shieldLeft - 1);
    }
    if (pendingLuckyCall) {
      newStats = {
        ...newStats,
        interest: Math.min(100, newStats.interest + LUCKY_CALL_INTEREST_BONUS),
        suspicion: Math.max(0, newStats.suspicion - LUCKY_CALL_SUSPICION_DISCOUNT),
      };
      setPendingLuckyCall(false);
    }
    setStats(newStats);
    const remainingConsumables = consumeOneOfEach(consumablesList);
    setConsumables(remainingConsumables);

    const nextIntro = newIndex === 0 ? welcomeIntro(nextHouse) : (houseIntros[nextHouse.id] ?? defaultIntro(nextHouse));
    const resolvedIntroMessages = nextIntro.messages.map((m) => ({ from: m.from, text: resolveText(m.text) }));
    const introMessages = flavor.message ? [flavor.message, ...resolvedIntroMessages] : resolvedIntroMessages;
    let newInbox = logMessages(loanInbox, "muzaffer", "Muzaffer Bey", introMessages, newIndex + 1);
    newInbox = pruneInbox(newInbox, currentResults, newIndex + 1);

    if (newIndex > 0 && currentResults.length > 0) {
      const dueCallback = pendingCallbacks.find((c) => c.dueIndex <= newIndex);
      const callback = dueCallback ? generateCallbackForResult(dueCallback.resultIndex, currentResults, allHouses, castAssignmentParam) : null;
      if (callback && dueCallback) {
        const remainingPendingCallbacks = pendingCallbacks.filter((c) => c !== dueCallback);
        setPendingCallbacks(remainingPendingCallbacks);
        const callbackHouse = allHouses.find((h) => h.id === currentResults[callback.resultIndex].houseId);
        newInbox = logMessages(newInbox, callbackHouse?.id ?? "muzaffer", callback.contactName, callback.messages, newIndex + 1);
        setInbox(newInbox);
        persist({ results: currentResults, weekOutcomes, badges, index: newIndex, ownedPerks: perksList, spent, consumables: remainingConsumables, unlockedTiers: tiersList, houseOrder: order, inbox: newInbox, castAssignment: castAssignmentParam, dailyQuest: currentQuest, slot: activeSlot, bonusEarnings: newBonusEarnings, pendingLoan: newPendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment: newPendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries: newPendingDeliveries, pendingCallbacks: remainingPendingCallbacks, bossMood, firedSeasonalEventWeeks: newFiredSeasonalEventWeeks, voiceTally: voiceTallyParam, origin: originParam, compassTally: compassTallyParam, significantMemories: significantMemoriesParam, originChoiceCount: originChoiceCountParam, selfReflectionShown: selfReflectionShownParam, unlockedFriendHouseIds: unlockedFriendHouseIdsParam, friendHouseResults: friendHouseResultsParam, energyLastRegenAt: energyLastRegenAtParam, minigameNextAvailableAt: minigameNextAvailableAtParam, minigamePlaysRemaining: minigamePlaysRemainingParam, ownedSkillIds: ownedSkillIdsParam, skillXP: skillXPParam, defeatedRivalIds: defeatedRivalIdsParam, friendBondCounts: friendBondCountsParam, friendBondMilestonesShown: friendBondMilestonesShownParam, flashbackShown: flashbackShownParam, secondChanceOffered: secondChanceOfferedParam, firedFatefulMomentIndices: newFiredFatefulMomentIndices });
        setActiveCallback({ ...callback, sessionKey: `${newIndex}-${callback.resultIndex}-${Date.now()}` });
        setIndex(newIndex);
        setStage("callback");
        return;
      }
    }
    setInbox(newInbox);
    persist({ results: currentResults, weekOutcomes, badges, index: newIndex, ownedPerks: perksList, spent, consumables: remainingConsumables, unlockedTiers: tiersList, houseOrder: order, inbox: newInbox, castAssignment: castAssignmentParam, dailyQuest: currentQuest, slot: activeSlot, bonusEarnings: newBonusEarnings, pendingLoan: newPendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment: newPendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries: newPendingDeliveries, bossMood, firedSeasonalEventWeeks: newFiredSeasonalEventWeeks, voiceTally: voiceTallyParam, origin: originParam, compassTally: compassTallyParam, significantMemories: significantMemoriesParam, originChoiceCount: originChoiceCountParam, selfReflectionShown: selfReflectionShownParam, unlockedFriendHouseIds: unlockedFriendHouseIdsParam, friendHouseResults: friendHouseResultsParam, energyLastRegenAt: energyLastRegenAtParam, minigameNextAvailableAt: minigameNextAvailableAtParam, minigamePlaysRemaining: minigamePlaysRemainingParam, ownedSkillIds: ownedSkillIdsParam, skillXP: skillXPParam, defeatedRivalIds: defeatedRivalIdsParam, friendBondCounts: friendBondCountsParam, friendBondMilestonesShown: friendBondMilestonesShownParam, flashbackShown: flashbackShownParam, secondChanceOffered: secondChanceOfferedParam, firedFatefulMomentIndices: newFiredFatefulMomentIndices });
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
    // "Gizli Gündem" — pressing on a suspicious detail occasionally earns a
    // one-line confession about the upcoming customer's real motive, logged
    // straight into their inbox thread before the visit even starts. The
    // reward numbers above are untouched — this is flavor only.
    let inboxForNextHouse = p.inboxList;
    const confession = choiceId === "uzerine-git" ? suspiciousDetailConfessions[activeTask.id] : undefined;
    if (confession) {
      const nextHouse = allHouses[p.order[p.newIndex] ?? p.newIndex];
      const contactName = resolveCustomerNames(nextHouse, p.castAssignmentParam)[0];
      inboxForNextHouse = logMessages(p.inboxList, nextHouse.id, contactName, [{ from: contactName, text: resolveText(confession) }], p.newIndex + 1);
    }
    proceedToHouseIntro(
      p.newIndex,
      p.currentResults,
      p.perksList,
      p.consumablesList,
      p.tiersList,
      p.order,
      inboxForNextHouse,
      p.castAssignmentParam,
      p.dailyQuestParam,
      choice?.reward ?? null,
      true,
    );
  }

  function completePostSaleCall(choiceId: string) {
    if (!activePostSaleCall || !pendingHouseEntry) return;
    const choice = activePostSaleCall.def.choices.find((c) => c.id === choiceId);
    const p = pendingHouseEntry;
    setActivePostSaleCall(null);
    setPendingHouseEntry(null);
    const newBossMood = choice?.bossMoodDelta ? clampBossMood(bossMood + choice.bossMoodDelta) : bossMood;
    if (choice?.bossMoodDelta) setBossMood(newBossMood);
    const newBonusEarnings = choice?.bonusEarningsDelta ? bonusEarnings + choice.bonusEarningsDelta : bonusEarnings;
    if (choice?.bonusEarningsDelta) setBonusEarnings(newBonusEarnings);
    let newInbox = p.inboxList;
    if (choice) {
      const playerMsg: PhoneMessage = { from: "Emlah", text: resolveText(choice.text) };
      const replyMsg: PhoneMessage = { from: activePostSaleCall.contactName, text: resolveText(choice.reply) };
      newInbox = logMessages(p.inboxList, activePostSaleCall.houseId, "Emlah", [playerMsg], p.newIndex + 1, true);
      newInbox = logMessages(newInbox, activePostSaleCall.houseId, activePostSaleCall.contactName, [replyMsg], p.newIndex + 1);
    }
    proceedToHouseIntro(
      p.newIndex,
      p.currentResults,
      p.perksList,
      p.consumablesList,
      p.tiersList,
      p.order,
      newInbox,
      p.castAssignmentParam,
      p.dailyQuestParam,
      null,
      true,
    );
  }

  // If a tier unlock happens while sitting on the "locked" gate, move on automatically.
  useEffect(() => {
    if (stage === "locked" && house.tier <= maxUnlockedTier) {
      enterPhone(index, results, ownedPerks, consumables, unlockedTiers);
    }
    // Kilit ekranından açılan geri arama bitince (satış olsun olmasın) akış
    // "phone"a döner — ev hâlâ kilitliyse ofise değil kilit ekranına geri gel,
    // yoksa oyuncu kilitli tier'ın evine "Bugünün İşini Al" ile girebilirdi.
    if (stage === "phone" && house && house.tier > maxUnlockedTier) {
      setStage("locked");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedTiers, stage]);

  // Sale-music crossfade bookkeeping: freshly entering "house" resets the
  // doorstep popup so every new sale asks for its own confirm tap; leaving
  // "house" (sold/lost/thinking outcome, any path) fades sale music back
  // out to the menu music, whether or not the player ever confirmed (e.g. a
  // mid-dialogue force-exit).
  useEffect(() => {
    const prev = prevStageForMusicRef.current;
    if (stage === "house" && prev !== "house") {
      setSaleIntroConfirmed(false);
    }
    if (prev === "house" && stage !== "house") {
      stopSaleMusic();
    }
    prevStageForMusicRef.current = stage;
  }, [stage]);

  function startNewGame(originId: OriginId) {
    if (getMusicVolume() > 0) startMusic();
    setOrigin(originId);
    setCompassTally({ durustluk: 0, kurnazlik: 0 });
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
    const prestigeCompletions = getPrestigeCompletions();
    track("game_start", { origin: originId, difficulty: getDifficulty(), prestige: prestigeCompletions });
    setBonusEarnings(prestigeStartingBonus(prestigeCompletions));
    setPrestigeTitleThisRun(prestigeTitle(prestigeCompletions));
    setPendingLoan(null);
    setPendingInvestment(null);
    setFriendBonds({});
    setActiveMeetup(null);
    setPendingMeetupBonus(null);
    setTasksCompleted(0);
    setChitchatBonuses(0);
    setPremiumResults([]);
    sq.setState(emptySideQuests());
    setOwnedInvestmentHouses([]);
    setInvestmentResults([]);
    setContactedCustomers([]);
    setActiveNewsId(null);
    setLastTipsterId(undefined);
    setEnergy(ENERGY_MAX);
    setEnergyLastRegenAt(Date.now());
    setMinigameNextAvailableAt(Date.now());
    setMinigamePlaysRemaining(2);
    setOwnedSkillIds([]);
    setSkillXP(0);
    setDefeatedRivalIds([]);
    setFriendBondCounts({});
    setFriendBondMilestonesShown([]);
    setFlashbackShown(false);
    setActiveFlashback(null);
    setSecondChanceOffered(false);
    setPendingFriendFavors({});
    setFriendFavorAccepted({});
    setBreadthConfrontationShown(false);
    setFiratFullCircleShown(false);
    setHardTimesUsed({});
    setFiredFatefulMomentIndices([]);
    setActiveFatefulMoment(null);
    setPendingDeliveries([]);
    setPendingCallbacks([]);
    setPausedVisit(null);
    setPausedVisitOffer(null);
    setBossMood(BOSS_MOOD_START);
    setFiredSeasonalEventWeeks([]);
    setVoiceTally({ eglenceli: 0, samimi: 0, atilgan: 0 });
    setSignificantMemories([]);
    setActiveMemoryReference(null);
    setOriginChoiceCount(0);
    setSelfReflectionShown(false);
    setActiveSelfReflection(null);
    setUnlockedFriendHouseIds([]);
    setFriendHouseResults([]);
    setActiveFriendHouseId(null);
    setShowEndingSequence(false);
    lastRankRef.current = null;
    // Land on the office first, with no message waiting — the boss's
    // welcome message only arrives once the player actually taps "Advance
    // to New Day" for the first time (see handleAdvanceDay's isFirstEverDay
    // branch), instead of a message silently sitting there before the
    // player has done anything.
    setIndex(0);
    setStage("phone");
    setShowPhoneOverlay(false);
    setDayAdvancedForIndex(null);
  }

  /** Settings' "Oyunu Bitir" — leaves the run mid-game. Nothing extra to save: every checkpoint already went through persist(). */
  function exitToMainMenu() {
    setShowEmlahMenu(false);
    setShowMessagesOnly(false);
    setShowIsler(false);
    setShowEnergyBreak(false);
    setShowPhoneOverlay(false);
    setPausedVisitOffer(null);
    setSavedGames(loadAllSaves());
    preSettingsStageRef.current = "menu";
    setStage("menu");
  }

  function openSaved() {
    setSavedGames(loadAllSaves());
    setStage("saved");
  }

  // continueSaved()'in ertelenmiş eve geçişi — bkz oradaki yorum.
  useEffect(() => {
    if (!resumeRequest) return;
    const { savedGame, catchUpRegenAt } = resumeRequest;
    setResumeRequest(null);
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
      savedGame.origin ?? null,
      savedGame.voiceTally ?? { eglenceli: 0, samimi: 0, atilgan: 0 },
      savedGame.compassTally ?? { durustluk: 0, kurnazlik: 0 },
      savedGame.significantMemories ?? [],
      savedGame.originChoiceCount ?? 0,
      savedGame.selfReflectionShown ?? false,
      savedGame.unlockedFriendHouseIds ?? [],
      savedGame.friendHouseResults ?? [],
      catchUpRegenAt,
      savedGame.minigameNextAvailableAt ?? Date.now(),
      savedGame.minigamePlaysRemaining ?? 2,
      savedGame.ownedSkillIds ?? [],
      savedGame.skillXP ?? 0,
      savedGame.defeatedRivalIds ?? [],
      savedGame.friendBondCounts ?? {},
      savedGame.friendBondMilestonesShown ?? [],
      savedGame.flashbackShown ?? false,
      savedGame.secondChanceOffered ?? false,
      savedGame.firedFatefulMomentIndices ?? [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeRequest]);

  function continueSaved(slot: number) {
    const savedGame = savedGames[slot];
    if (!savedGame) return;
    if (getMusicVolume() > 0) startMusic();
    setActiveSlot(slot);
    setPrestigeTitleThisRun(prestigeTitle(getPrestigeCompletions()));
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
    sq.setState(normalizeSideQuests(savedGame.sideQuests));
    setOwnedInvestmentHouses(savedGame.ownedInvestmentHouses ?? []);
    setInvestmentResults(savedGame.investmentResults ?? []);
    setContactedCustomers(savedGame.contactedCustomers ?? []);
    setActiveNewsId(savedGame.activeNewsId ?? null);
    // Passive energy regen accrues in real time even while the app was
    // closed — catch it up here against the device clock, same math as
    // the in-session check in enterPhone().
    const savedRegenAt = savedGame.energyLastRegenAt ?? Date.now();
    const { gained: catchUpGain, newLastRegenAt: catchUpRegenAt } = computePassiveEnergyRegen(savedRegenAt, Date.now());
    setEnergy(Math.min(ENERGY_MAX, (savedGame.energy ?? ENERGY_MAX) + catchUpGain));
    setEnergyLastRegenAt(catchUpRegenAt);
    setMinigameNextAvailableAt(savedGame.minigameNextAvailableAt ?? Date.now());
    setMinigamePlaysRemaining(savedGame.minigamePlaysRemaining ?? 2);
    setOwnedSkillIds(savedGame.ownedSkillIds ?? []);
    setSkillXP(savedGame.skillXP ?? 0);
    setDefeatedRivalIds(savedGame.defeatedRivalIds ?? []);
    setFriendBondCounts(savedGame.friendBondCounts ?? {});
    setFriendBondMilestonesShown(savedGame.friendBondMilestonesShown ?? []);
    setFlashbackShown(savedGame.flashbackShown ?? false);
    setActiveFlashback(null);
    setSecondChanceOffered(savedGame.secondChanceOffered ?? false);
    setPendingFriendFavors(savedGame.pendingFriendFavors ?? {});
    setFriendFavorAccepted(savedGame.friendFavorAccepted ?? {});
    setBreadthConfrontationShown(savedGame.breadthConfrontationShown ?? false);
    setFiratFullCircleShown(savedGame.firatFullCircleShown ?? false);
    setHardTimesUsed(savedGame.hardTimesUsed ?? {});
    setFiredFatefulMomentIndices(savedGame.firedFatefulMomentIndices ?? []);
    setActiveFatefulMoment(null);
    setPendingDeliveries(savedGame.pendingDeliveries ?? []);
    setPendingCallbacks(savedGame.pendingCallbacks ?? []);
    setPausedVisit(savedGame.pausedVisit ?? null);
    setBossMood(savedGame.bossMood ?? BOSS_MOOD_START);
    setFiredSeasonalEventWeeks(savedGame.firedSeasonalEventWeeks ?? []);
    setVoiceTally(savedGame.voiceTally ?? { eglenceli: 0, samimi: 0, atilgan: 0 });
    setOrigin(savedGame.origin ?? null);
    setCompassTally(savedGame.compassTally ?? { durustluk: 0, kurnazlik: 0 });
    setSignificantMemories(savedGame.significantMemories ?? []);
    setActiveMemoryReference(null);
    setOriginChoiceCount(savedGame.originChoiceCount ?? 0);
    setSelfReflectionShown(savedGame.selfReflectionShown ?? false);
    setActiveSelfReflection(null);
    setUnlockedFriendHouseIds(savedGame.unlockedFriendHouseIds ?? []);
    setFriendHouseResults(savedGame.friendHouseResults ?? []);
    setActiveFriendHouseId(null);
    setShowEndingSequence(false);
    lastRankRef.current = null;
    // enterPhone() bu turda senkron çağrılırsa içindeki persist(), yukarıdaki
    // setX'ler henüz işlenmediği için ESKİ (menüdeki/varsayılan) state'i
    // okuyup diske yazıyordu: harcama 0'a, rozetler/bonuslar boşa, enerji
    // 100'e, bekleyen iş null'a dönüyordu (oyuncu yükleyip hemen çıkarsa
    // kayıt bozuk kalıyordu). Yüklenen state işlendikten sonraki render'da çalıştır.
    setResumeRequest({ savedGame, catchUpRegenAt });
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

  function finalizeResult(
    outcome: SceneOutcome,
    contractModifier: number,
    contractSelections?: Record<string, string>,
    opts?: { declined?: boolean },
  ) {
    const declined = opts?.declined === true;
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
      // Reddedilen iş hiç gezilmedi — retriedLost ile tüm geri arama/ikinci şans akışlarının dışında kalır.
      ...(declined ? { declined: true, retriedLost: true } : {}),
    };
    const newResults = [...results, newResult];
    setResults(newResults);
    setBestLineThisHouse(null);
    track("house_result", {
      house: house.id,
      tier: house.tier,
      outcome: declined ? "declined" : outcome,
      suspicion: Math.round(stats.suspicion),
      interest: Math.round(stats.interest),
      fun: Math.round(stats.fun),
      discount: stats.discountPercent,
      commission: sale?.commission ?? 0,
      energy,
    });

    // Takip Mesajı zamanlaması — satış anında değil, %15 ihtimalle ileride
    // (en erken 1 gün sonra, bazen 3-8 gün arası) bu müşteriden bir mesaj
    // gelsin diye kaydediyoruz. Tüketimi proceedToHouseIntro'da olur.
    let newPendingCallbacks = pendingCallbacks;
    const callbackChance = 0.15 + (hasPerk(ownedPerks, "referans-agi") ? 0.15 : 0);
    if (!declined && Math.random() < callbackChance) {
      const dueOffset = Math.random() < 0.5 ? 1 : 3 + Math.floor(Math.random() * 6);
      newPendingCallbacks = [...pendingCallbacks, { resultIndex: newResults.length - 1, dueIndex: index + dueOffset }];
      setPendingCallbacks(newPendingCallbacks);
    }

    // "Emlah'ın İç Sesi" — a small, guaranteed XP trickle regardless of outcome.
    const newSkillXP = declined ? skillXP : skillXP + xpForOutcome(outcome);
    setSkillXP(newSkillXP);
    const newContactedCustomers = declined ? contactedCustomers : addContactedCustomer(house, castAssignment, contactedCustomers);
    setContactedCustomers(newContactedCustomers);

    // Karar Anıları — record a new defining moment (if this one qualifies),
    // and clear whichever memory this house may have just referenced.
    let newSignificantMemories = significantMemories;
    const newMemory = declined ? null : maybeRecordMemory(outcome, stats, house.id, house.title, index);
    if (newMemory) newSignificantMemories = pushMemory(significantMemories, newMemory);
    if (newSignificantMemories !== significantMemories) setSignificantMemories(newSignificantMemories);
    if (activeMemoryReference?.houseId === house.id) setActiveMemoryReference(null);

    // "Şehrin Kurtları" — the active ladder rival's name drives the same
    // bonus-only duel messages Fırat Bey always used; only Fırat (ladder
    // rung 1) also gets the richer in-dialogue mood encounter.
    const activeRival = activeRivalFor(defeatedRivalIds);

    // Rakip Emlakçı Düellosu — bonus-only, never an extra penalty beyond
    // whatever outcome already happened.
    let newBonusEarnings = bonusEarnings;
    let newInbox = inbox;
    if (activeDuelHouseId === house.id) {
      if (outcome === "sold" && sale) {
        const duelBonus = Math.round(house.askingPrice * RIVAL_DUEL_BONUS_RATE);
        newBonusEarnings += duelBonus;
        newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: `${pickDuelWinMessage(activeRival.name)} (+${formatTL(duelBonus)})` }], index + 1);
      } else {
        newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: pickDuelLoseMessage(activeRival.name) }], index + 1);
      }
      setActiveDuelHouseId(null);
      setActiveFiratMood(null);
    }

    // "Şehrin Kurtları" ladder advancement — lifetime sold count reaching
    // the active rival's threshold retires them, purely a flavor message
    // + save-state advance, never touches suspicion/interest/fun/closingBias.
    let newDefeatedRivalIds = defeatedRivalIds;
    const totalSoldCount = newResults.filter((r) => r.outcome === "sold").length;
    if (totalSoldCount + sq.rivalHeadStart >= activeRival.threshold && !defeatedRivalIds.includes(activeRival.id)) {
      newDefeatedRivalIds = [...defeatedRivalIds, activeRival.id];
      setDefeatedRivalIds(newDefeatedRivalIds);
      newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: resolveText(activeRival.victoryLine) }], index + 1);
    }

    // Gizli Müşteri — silent until now; reveals itself only in the reaction
    // message, small bonusEarnings adjustment only, never touches suspicion
    // or any stored result.
    if (mysteryShopperHouseId === house.id) {
      const verdict = mysteryShopperVerdict(stats.suspicion);
      if (verdict === "honest") newBonusEarnings += MYSTERY_SHOPPER_HONEST_BONUS;
      else if (verdict === "sneaky") newBonusEarnings -= MYSTERY_SHOPPER_SNEAKY_PENALTY;
      const pastContactName =
        contactedCustomers.length > 0
          ? contactedCustomers[Math.floor(Math.random() * contactedCustomers.length)].name
          : undefined;
      newInbox = logMessages(
        newInbox, house.id, "Gizli Müşteri",
        [{ from: "Gizli Müşteri", text: pickMysteryShopperReveal(verdict, pastContactName) }],
        index + 1,
      );
      setMysteryShopperHouseId(null);
      sq.album("gizli-musteri");
    }
    if (activeEasterEgg?.houseId === house.id) setActiveEasterEgg(null);
    // Patron Memnuniyeti — a heavily discounted sale annoys Muzaffer Bey;
    // a clean one pleases him. Never feeds back into resolveOutcome/scoring,
    // only gates the separate weekly "zam" bonus below.
    let newBossMood = bossMood;
    if (declined) {
      newBossMood = clampBossMood(bossMood - DECLINE_BOSS_MOOD_PENALTY);
      newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: pickDeclineBossLine() }], index + 1);
    }
    if (outcome === "sold" && sale) {
      triggerHaptic("success");
      const angry = stats.discountPercent > DISCOUNT_ANGER_THRESHOLD;
      newBossMood = clampBossMood(bossMood + bossMoodDeltaForSale(stats.discountPercent));
      if (angry) {
        newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: pickDiscountAngerLine() }], index + 1);
      } else if (Math.random() < 0.25) {
        newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: pickCleanSaleLine() }], index + 1);
      }
    }
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
    // Efsane Modu — records once per finished playthrough; lives in its own
    // localStorage key outside SaveGame, so no version bump needed here.
    if (gameComplete) recordGameCompletion();
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
      track("week_end", {
        week: weekIdx + 1,
        sales: weekOutcome.salesMade,
        target: weekOutcome.salesTarget,
        salesGoal: weekOutcome.salesGoalMet ? 1 : 0,
        honestyGoal: weekOutcome.honestyGoalMet ? 1 : 0,
        avgSuspicion: Math.round(weekOutcome.avgSuspicion),
        bossMood,
      });

      // Patron Memnuniyeti — hitting the week's sales target pleases him too,
      // and at week's end his mood gates a separate small "haftalık zam"
      // bonus, additive on top of the existing sales/honesty bonus above.
      if (weekOutcome.salesGoalMet) newBossMood = clampBossMood(newBossMood + BOSS_MOOD_WEEK_GOAL_GAIN);
      // Sadakat Rozetleri — once unlocked, Muzaffer Bey uses the origin's nickname here instead of "Emlah".
      const originNickname = originById(origin)?.nickname;
      const addressName =
        originChoiceCount >= LOYALTY_THRESHOLD && originNickname ? resolveText(originNickname) : t({ tr: "Emlah", en: "Estetan" });
      if (newBossMood >= BOSS_MOOD_RAISE_THRESHOLD) {
        newBonusEarnings += WEEKLY_RAISE_AMOUNT;
        newInbox = logMessages(
          newInbox, "muzaffer", "Muzaffer Bey",
          [
            {
              from: "Muzaffer Bey",
              text: t({
                tr: `Bu hafta senden memnunum ${addressName}, küçük bir zam yaptım (+${formatTL(WEEKLY_RAISE_AMOUNT)}).`,
                en: `I'm pleased with you this week, ${addressName}, I gave you a small raise (+${formatTL(WEEKLY_RAISE_AMOUNT)}).`,
              }),
            },
          ],
          index + 1,
        );
      } else {
        newInbox = logMessages(
          newInbox, "muzaffer", "Muzaffer Bey",
          [
            {
              from: "Muzaffer Bey",
              text: t({
                tr: `Bu hafta zam yok ${addressName}, biraz daha dikkatli olmalısın.`,
                en: `No raise this week, ${addressName}, you should be a bit more careful.`,
              }),
            },
          ],
          index + 1,
        );
      }
    } else {
      setPendingWeekOutcome(null);
    }

    if (newBossMood !== bossMood) setBossMood(newBossMood);
    if (newInbox !== inbox) setInbox(newInbox);
    if (newBonusEarnings !== bonusEarnings) setBonusEarnings(newBonusEarnings);

    persist({ results: newResults, weekOutcomes: newWeekOutcomes, badges: newBadgesState, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings: newBonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers: newContactedCustomers, activeNewsId, energy: newEnergy, pendingDeliveries: newPendingDeliveries, pendingCallbacks: newPendingCallbacks, bossMood: newBossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories: newSignificantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP: newSkillXP, defeatedRivalIds: newDefeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown, ...(declined ? { pausedVisit: null } : {}) });
    sq.onHouseResolved(outcome, stats, house, sale, index, declined);
    setStage("result");
  }

  /** Gizli evler (A1 yalı, B7 55. ev) — Özel Davet gibi oynanır, sonuç yan görev durumuna yazılır. */
  function finishSecretHouse(outcome: SceneOutcome, contractModifier: number, finalStats: GameStats) {
    const id = activeSecretHouseId;
    const secret = id ? secretHouseById(id) : undefined;
    setActiveSecretHouseId(null);
    if (!id || !secret) return;
    if (outcome === "sold") {
      const sale = computeSale(secret.askingPrice, finalStats.discountPercent, 0, contractModifier, rankBonus(earned));
      setBonusEarnings((b) => b + sale.commission);
      playSale();
      triggerHaptic("success");
    } else if (outcome === "lost") playLost();
    else playThinking();
    sq.finishSecretHouse(id, outcome);
    if (id === "emlahin-evi") {
      setShowEndingSequence(true);
      setStage("summary");
    }
  }

  function openPremiumHouse(houseId: string) {
    setActivePremiumHouseId(houseId);
    setShowEmlahMenu(false);
  }

  function finishPremiumHouse(outcome: SceneOutcome, contractModifier: number, finalStats: GameStats, contractSelections?: Record<string, string>) {
    const premiumHouse = premiumHouses.find((h) => h.id === activePremiumHouseId);
    if (!premiumHouse) return;
    const premiumCastId = castAssignment[premiumHouse.id]?.[0];
    if (premiumCastId && celebrityById(premiumCastId)) sq.album("unlu");
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
    if (outcome === "sold") {
      playSale();
      triggerHaptic("success");
    } else if (outcome === "lost") playLost();
    else playThinking();

    // Patron Memnuniyeti — same discount consequence as a main-house sale.
    let newBossMood = bossMood;
    let newInbox = inbox;
    if (outcome === "sold" && sale) {
      const angry = finalStats.discountPercent > DISCOUNT_ANGER_THRESHOLD;
      newBossMood = clampBossMood(bossMood + bossMoodDeltaForSale(finalStats.discountPercent));
      if (angry) {
        newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: pickDiscountAngerLine() }], index + 1);
      }
    }
    if (newBossMood !== bossMood) setBossMood(newBossMood);
    if (newInbox !== inbox) setInbox(newInbox);

    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults: newPremiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers: newContactedCustomers, activeNewsId, energy, pendingDeliveries: newPendingDeliveries, bossMood: newBossMood });
    setActivePremiumHouseId(null);
    setEmlahMenuTab("davet");
    setShowEmlahMenu(true);
  }

  function openFriendHouse(houseId: string) {
    setActiveFriendHouseId(houseId);
    setShowEmlahMenu(false);
  }

  function finishFriendHouse(outcome: SceneOutcome, contractModifier: number, finalStats: GameStats, contractSelections?: Record<string, string>) {
    const friendHouse = friendHouseById(activeFriendHouseId ?? "");
    if (!friendHouse) return;
    const rawSale =
      outcome === "sold"
        ? computeSale(friendHouse.askingPrice, finalStats.discountPercent, 0, contractModifier, rankBonus(earned))
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
            id: `${friendHouse.id}-${index}-arkadas`,
            houseTitle: friendHouse.title,
            deliveryDateLabel: formatGameDate(deliveryDateForIndex(index, term)),
            dueIndex,
            deferredAmount,
          },
        ];
        setPendingDeliveries(newPendingDeliveries);
      }
    }

    const newResult: HouseResult = {
      houseId: friendHouse.id,
      outcome,
      sale,
      finalStats,
      finalSuspicion: finalStats.suspicion,
    };
    const newFriendHouseResults = [...friendHouseResults, newResult];
    setFriendHouseResults(newFriendHouseResults);
    if (outcome === "sold") {
      playSale();
      triggerHaptic("success");
    } else if (outcome === "lost") playLost();
    else playThinking();

    let newBossMood = bossMood;
    let newInbox = inbox;
    if (outcome === "sold" && sale) {
      const angry = finalStats.discountPercent > DISCOUNT_ANGER_THRESHOLD;
      newBossMood = clampBossMood(bossMood + bossMoodDeltaForSale(finalStats.discountPercent));
      if (angry) {
        newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: pickDiscountAngerLine() }], index + 1);
      }
    }
    if (newBossMood !== bossMood) setBossMood(newBossMood);
    if (newInbox !== inbox) setInbox(newInbox);

    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries: newPendingDeliveries, bossMood: newBossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults: newFriendHouseResults });
    setActiveFriendHouseId(null);
    setEmlahMenuTab("arkadaslar");
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
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent: newSpent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses: newOwned });
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
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent: newSpent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses: newOwned });
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

    if (outcome === "sold") {
      playSale();
      triggerHaptic("success");
    } else if (outcome === "lost") playLost();
    else playThinking();

    persist({ results, weekOutcomes, badges: newBadgesState, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses: newOwnedInvestmentHouses, investmentResults: newInvestmentResults, contactedCustomers: newContactedCustomers, activeNewsId, energy, pendingDeliveries: newPendingDeliveries });
    setActiveInvestmentSaleId(null);
    setPitchTargetContact(null);
    setEmlahMenuTab("yatirim");
    setShowEmlahMenu(true);
  }

  function trackGameEnd() {
    track("game_end", {
      ending: resolveText(computeEnding(results, earned).title, "tr"), // panoda dil fark etmeksizin tek ad
      origin,
      sold: results.filter((r) => r.outcome === "sold").length,
      earned,
      bossMood,
    });
  }

  function proceedAfterResult() {
    if (pendingWeekOutcome) {
      setStage("weekGoal");
      return;
    }
    if (isLastHouse) {
      trackGameEnd();
      // B7 — şartları sağlayan oyuncuya gizli 55. ev, finalden hemen önce.
      if (sq.shouldOfferHome(results, compassTally)) {
        setActiveSecretHouseId("emlahin-evi");
        return;
      }
      setShowEndingSequence(true);
      setStage("summary");
    } else {
      enterPhone(index + 1, results, ownedPerks, consumables, unlockedTiers);
    }
  }

  function proceedAfterWeek() {
    setPendingWeekOutcome(null);
    setDailyQuestResult(null);
    if (isLastHouse) {
      trackGameEnd();
      // B7 — şartları sağlayan oyuncuya gizli 55. ev, finalden hemen önce.
      if (sq.shouldOfferHome(results, compassTally)) {
        setActiveSecretHouseId("emlahin-evi");
        return;
      }
      setShowEndingSequence(true);
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
      reputation: reputationLabelDisplay(reputationLabel(results)),
      rank: rankTitleDisplay(rankTitle(earned)),
      badgeCount: badges.length,
      endingTitle: resolveText(ending.title),
      endingDescription: resolveText(ending.description),
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "simsar-emlak-sonuc.png";
    a.click();
  }

  /** Builds the one-shot cinematic reel shown right before the plain summary screen — pure presentation over data already computed for that screen. */
  function buildEndingSlides(): EndingSlide[] {
    const slides: EndingSlide[] = [];
    const soldCount = results.filter((r) => r.outcome === "sold").length;

    slides.push({
      icon: "trophy",
      eyebrow: t({ tr: "Kariyerinin Sonu", en: "The End of Your Career" }),
      title: rankTitleDisplay(rankTitle(earned)),
      body: [
        t({
          tr: `${soldCount} ev sattın, toplamda ${formatTL(earned)} kazandın.`,
          en: `You sold ${soldCount} houses, earning ${formatTL(earned)} in total.`,
        }),
      ],
    });

    const allResultsWithSale = [...results, ...premiumResults, ...investmentResults, ...friendHouseResults].filter(
      (r) => r.outcome === "sold" && r.sale,
    );
    if (allResultsWithSale.length > 0) {
      const best = allResultsWithSale.reduce((a, b) => ((b.sale?.commission ?? 0) > (a.sale?.commission ?? 0) ? b : a));
      const bestHouse = [...allHouses, ...premiumHouses, ...investmentHouses, ...friendHouses].find((h) => h.id === best.houseId);
      if (bestHouse) {
        slides.push({
          icon: "coin",
          eyebrow: t({ tr: "En İyi Satışın", en: "Your Best Sale" }),
          title: resolveHouseTitle(bestHouse),
          body: [
            t({
              tr: `${formatTL(best.sale?.commission ?? 0)} komisyonla kariyerinin en iyi anlaşmasıydı.`,
              en: `The best deal of your career, at ${formatTL(best.sale?.commission ?? 0)} commission.`,
            }),
          ],
        });
      }
    }

    const allResultsWithLine = [...results, ...premiumResults, ...investmentResults, ...friendHouseResults].filter((r) => r.bestLine);
    if (allResultsWithLine.length > 0) {
      const best = allResultsWithLine.reduce((a, b) => ((b.bestLineFun ?? 0) > (a.bestLineFun ?? 0) ? b : a));
      slides.push({
        icon: "chat",
        eyebrow: t({ tr: "En Akılda Kalan Anın", en: "Your Most Memorable Moment" }),
        title: `"${best.bestLine}"`,
        body: [],
      });
    }

    if (badges.length > 0) {
      slides.push({
        icon: "medal",
        eyebrow: t({ tr: "Kazanılan Rozetler", en: "Badges Earned" }),
        title: t({ tr: `${badges.length} rozet`, en: `${badges.length} badges` }),
        body: badges.slice(0, 3).map((id) => (allBadges[id] ? resolveText(allBadges[id].title) : id)),
      });
    }

    const personality = personalitySummary(voiceTally);
    const compass = compassVerdict(compassTally);
    if (personality || compass) {
      slides.push({
        icon: "smile",
        eyebrow: t({ tr: "Karakterin", en: "Your Character" }),
        title: t({ tr: "Emlah Kimdi?", en: "Who Was Estetan?" }),
        body: [personality, compass].filter((s): s is string => !!s),
      });
    }

    slides.push(...sq.endingSlides());

    const ending = computeEnding(results, earned);
    const epilogue = originEndingLine(origin, resolveText(ending.title));
    slides.push({
      icon: "clapper",
      eyebrow: t({ tr: "Son", en: "The End" }),
      title: resolveText(ending.title),
      body: [resolveText(ending.description), epilogue].filter((s): s is string => !!s),
    });

    // Efsane Modu already counts EVERY completed playthrough (recordGameCompletion()
    // fires purely on reaching the last house, regardless of which ending —
    // "Kovuldu" included) but this was never actually surfaced anywhere, so
    // players had no idea a rough run still carried something forward. Read
    // fresh since recordGameCompletion() already ran for THIS run by now.
    const completions = getPrestigeCompletions();
    unlockAchievement(ACHIEVEMENT_IDS.allHousesSold);
    if (completions >= 1) unlockAchievement(ACHIEVEMENT_IDS.prestigeCompleted);
    const nextBonus = prestigeStartingBonus(completions);
    slides.push({
      icon: "star",
      eyebrow: t({ tr: "Bu Hikaye Burada Bitse De", en: "Even Though This Story Ends Here" }),
      title: prestigeTitle(completions) ?? t({ tr: "Efsane", en: "Legend" }),
      body: [
        t({
          tr: `Bu, ${completions}. tamamladığın oyun — ister parlak bir kariyer, ister kovulma ile bitsin, hepsi sayılıyor.`,
          en: `This is playthrough #${completions} you've completed — whether it ends in a bright career or getting fired, it all counts.`,
        }),
        nextBonus > 0
          ? t({
              tr: `Bir sonraki oyununa ${formatTL(nextBonus)} başlangıç bonusuyla başlayacaksın.`,
              en: `Your next game will start with a ${formatTL(nextBonus)} bonus.`,
            })
          : t({ tr: "Bir sonraki oyunun bu turdan bir iz taşıyacak.", en: "Your next game will carry a trace of this run." }),
      ],
    });

    slides.push({
      icon: "spark",
      eyebrow: t({ tr: "Hikaye Burada Bitmiyor", en: "The Story Doesn't End Here" }),
      title: t({ tr: "Odd Estate Gelişmeye Devam Ediyor", en: "Odd Estate Keeps Growing" }),
      body: [
        t({
          tr: "Emlah'ın hikayesi bu turla kapanmıyor — yeni semtler, yeni karakterler ve yeni mekaniklerle düzenli güncellemeler almaya devam edecek.",
          en: "Estetan's story doesn't close with this run — new districts, new characters, and new mechanics keep arriving in regular updates.",
        }),
        t({
          tr: "Bir sonraki turunda seni neyin beklediğini görmek için yakında tekrar uğra.",
          en: "Come back soon to see what's waiting for you in your next run.",
        }),
      ],
    });

    return slides;
  }

  function handleEnergyBreakChoice(activityId: string, tier: MiniGameTier) {
    const activity = energyBreakActivities.find((a) => a.id === activityId);
    if (!activity) return;
    if (getPlaysRemaining(activityId) <= 0) return;
    recordPlay(activityId);
    // The modal stays open after each play (no setShowEnergyBreak(false)
    // here) so the player can keep playing (within their remaining plays,
    // see minigameSchedule.ts) until satisfied, then close it manually.
    // Each mini-game is now a 3-try session (see EnergyMiniGames.tsx) — a
    // session either lands on "great" (first hit wins) or "fail" (all 3
    // tries missed, no reward).
    const tierGain = tier === "great" ? activity.energyGain : 0;
    const newEnergy = Math.min(ENERGY_MAX, energy + tierGain);
    setEnergy(newEnergy);
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy: newEnergy, pendingDeliveries, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining });
  }

  // Enerji %{ENERGY_LOW_THRESHOLD} altına düşünce ödüllü reklam seçeneği açılır (bkz data/ads.ts — şimdilik mock).
  function handleWatchAdForEnergy() {
    const newEnergy = Math.min(ENERGY_MAX, energy + AD_ENERGY_REWARD);
    setEnergy(newEnergy);
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy: newEnergy, pendingDeliveries, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining });
  }

  function handleSpendJettonsForEnergy() {
    if (!spendJettons(JETTON_ENERGY_REFILL_COST)) return;
    setJettonsState(getJettons());
    const newEnergy = Math.min(ENERGY_MAX, energy + JETTON_ENERGY_REFILL_AMOUNT);
    setEnergy(newEnergy);
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy: newEnergy, pendingDeliveries, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining });
  }

  async function handleBuyJettonPackage(pkg: JettonPackage) {
    const ok = await purchaseJettonPackage(pkg);
    if (ok) {
      setJettonsState(getJettons());
      playPurchase();
      unlockAchievement(ACHIEVEMENT_IDS.jettonPurchased);
      if (pkg.amount === 100) unlockAchievement(ACHIEVEMENT_IDS.jetton100Purchased);
    }
  }

  function handleBuyInventoryItem(itemId: string) {
    const item = inventoryItems.find((i) => i.id === itemId);
    if (!item) return;
    if (item.id === "guaranteed-second-chance" && pickSecondChanceCandidateIndex(results) === null) return;
    if (item.currency === "jetton") {
      if (!spendJettons(item.cost)) return;
      setJettonsState(getJettons());
    } else {
      if (balance < item.cost) return;
      const newSpent = spent + item.cost;
      setSpent(newSpent);
      persist({ results, weekOutcomes, badges, index, ownedPerks, spent: newSpent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy });
    }
    playPurchase();
    switch (item.id) {
      case "suspicion-shield":
        setShieldHousesLeft(SUSPICION_SHIELD_HOUSES);
        setShieldHousesLeftState(SUSPICION_SHIELD_HOUSES);
        break;
      case "lucky-call":
        setPendingLuckyCall(true);
        break;
      case "energy-box":
        setEnergy(ENERGY_MAX);
        break;
      case "confidence-outfit":
        setPendingSuspicionDiscount((d) => d + CONFIDENCE_OUTFIT_DISCOUNT);
        break;
      case "desk-lamp":
        setPendingInterestBonus((b) => b + DESK_LAMP_INTEREST_BONUS);
        break;
      case "wall-painting":
        setPendingFunBonus((b) => b + WALL_PAINTING_FUN_BONUS);
        break;
      case "potted-plant":
        setPendingSuspicionDiscount((d) => d + POTTED_PLANT_SUSPICION_DISCOUNT);
        break;
      case "coffee-machine":
        setEnergy((e) => Math.min(ENERGY_MAX, e + COFFEE_MACHINE_ENERGY));
        break;
      case "comfort-chair":
        setEnergy((e) => Math.min(ENERGY_MAX, e + COMFORT_CHAIR_ENERGY));
        break;
      case "trophy-shelf":
        setPendingInterestBonus((b) => b + TROPHY_SHELF_INTEREST_BONUS);
        break;
      case "new-sign":
        setBossMood((m) => clampBossMood(m + NEW_SIGN_BOSS_MOOD_GAIN));
        break;
      case "guaranteed-second-chance": {
        const idx = pickSecondChanceCandidateIndex(results);
        if (idx !== null) retryFromInbox(results[idx].houseId);
        break;
      }
      case "flawless-impression":
        setPendingFunBonus((b) => b + FLAWLESS_IMPRESSION_FUN_BONUS);
        break;
      case "boss-note":
        setBossMood((m) => clampBossMood(m + BOSS_NOTE_MOOD_GAIN));
        break;
      case "solid-reference":
        setPendingSuspicionDiscount((d) => d + SOLID_REFERENCE_SUSPICION_DISCOUNT);
        break;
      case "energy-reserve":
        setEnergy((e) => Math.min(ENERGY_MAX, e + ENERGY_RESERVE_AMOUNT));
        break;
      case "lucky-appointment":
        setPendingInterestBonus((b) => b + LUCKY_APPOINTMENT_INTEREST_BONUS);
        break;
    }
  }

  async function handleBuyFullVersionFromStore() {
    const ok = await purchaseFullUnlock();
    if (ok) {
      setFullUnlockedState(true);
      playPurchase();
      // Tam sürüm artık geçiş reklamlarını da kaldırıyor — "Tam Destek" tek alımla açılır.
      unlockAchievement(ACHIEVEMENT_IDS.fullSupport);
    }
  }

  async function handleBuyBundleFullJetton30() {
    const ok = await purchaseBundleFullJetton30();
    if (ok) {
      setFullUnlockedState(true);
      setJettonsState(getJettons());
      playPurchase();
      unlockAchievement(ACHIEVEMENT_IDS.fullSupport);
    }
  }

  async function handleRestorePurchases() {
    await syncPurchasesFromRevenueCat();
    setFullUnlockedState(isFullUnlocked());
  }

  async function handleAdvanceDay() {
    playDayAdvance();
    if (shouldShowInterstitialOnDayAdvance() && !isAdsRemoved()) {
      await showInterstitialAd();
    }
    // A brand-new game's very first day: nothing has been queued into the
    // inbox yet (startNewGame deliberately skipped it, see its comment) —
    // do that now, right as the player advances into day 1 for the first time.
    const isFirstEverDay = index === 0 && dayAdvancedForIndex === null;
    if (isFirstEverDay) {
      enterPhone(
        0, [], [], {}, [1], houseOrder, [], castAssignment, null, origin,
        { eglenceli: 0, samimi: 0, atilgan: 0 }, { durustluk: 0, kurnazlik: 0 }, [], 0,
        false, [], [], Date.now(), Date.now(), 2, [], 0, [], {}, [], false, false, [],
      );
    }
    if (pausedVisit?.status === "scheduled") {
      // Müşterinin önerdiği tarihe bir gün daha yaklaşıldı — bu sırada yeni
      // bir iş rulosu atılmıyor, bugünün işi zaten belli (sadece ertelenmiş).
      // Randevu beklenirken geçen her gün gerçek bir gün: aktiviteler sıfırlanır
      // ve geri sayım kaydedilir (yoksa uygulama yeniden açılınca sayaç başa döner).
      const remaining = (pausedVisit.daysRemaining ?? 1) - 1;
      const newPausedVisit: PausedVisit = remaining <= 0 ? { ...pausedVisit, status: "office", daysRemaining: undefined } : { ...pausedVisit, daysRemaining: remaining };
      setPausedVisit(newPausedVisit);
      setDayActivitiesDone([]);
      persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries, pendingCallbacks, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown, pausedVisit: newPausedVisit });
    } else if (!pausedVisit) {
      // Bugün bir iş çıkar mı — sabit %70, ama bir önceki ev satılmadıysa
      // (thinking/lost) göreceli %40 düşüşle ~%42'ye iner. "Yeni Güne Geç"
      // tekrar tıklanırsa (önceki roll'de iş çıkmadıysa) yeniden rulo atılır.
      const prevSold = results.length === 0 || results[results.length - 1].outcome === "sold";
      const jobChance = prevSold ? JOB_AVAILABLE_CHANCE : JOB_AVAILABLE_CHANCE * (1 - JOB_UNSOLD_PENALTY);
      setJobAvailable(Math.random() < jobChance);
    }
    setDayAdvancedForIndex(index);
  }

  function handleDoDayActivity(activityId: string) {
    if (dayActivitiesDone.includes(activityId)) return;
    // Pazarlama ve Ofis İşleri artık mini oyun — etki oyun bitince kademeye göre uygulanır.
    if (activityMiniGames[activityId]) {
      forgottenFileRef.current = null;
      setActiveActivityGame(activityId);
      return;
    }
    applyDayActivity(activityId, 1);
    // A3 — Esnafla Çay: Muhtar Cemal'in defteri.
    if (activityId === "tea") sq.openMuhtar(true);
  }

  /** Tapu Masası mükemmel bittiğinde: şansla kaçmış bir müşteriye tekrar ulaşma hakkı (geri arama bayrağı sıfırlanır). */
  function rollForgottenFile(): string | null {
    if (Math.random() >= FORGOTTEN_FILE_CHANCE) return null;
    const candidates = results
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => !r.declined && ((r.outcome === "lost" && r.retriedLost) || (r.outcome === "thinking" && r.followedUpThinking)));
    if (candidates.length === 0) return null;
    const { r, i } = candidates[Math.floor(Math.random() * candidates.length)];
    const h = allHouses.find((x) => x.id === r.houseId);
    if (!h) return null;
    forgottenFileRef.current = i;
    const name = resolveCustomerNames(h, castAssignment)[0] ?? resolveHouseTitle(h);
    return t({
      tr: `Unutulmuş dosya! ${name} ile tekrar görüşme hakkın açıldı (Mesajlar).`,
      en: `Forgotten file! You can reach out to ${name} again (Messages).`,
    });
  }

  function applyDayActivity(activityId: string, tier: ActivityTier) {
    if (dayActivitiesDone.includes(activityId)) return;
    const activity = dayActivities.find((a) => a.id === activityId);
    if (!activity) return;
    const newEnergy = Math.max(0, energy - activity.energyCost);
    setEnergy(newEnergy);
    setDayActivitiesDone((prev) => [...prev, activityId]);
    let newBossMood = bossMood;
    let newBonusEarnings = bonusEarnings;
    let newResults = results;
    if (activityId === "research") {
      // Bugünkü evin statları enterPhone'da zaten kuruldu — bekleyen indirim
      // havuzuna atmak etkiyi bir SONRAKİ müşteriye kaydırıyordu. Doğrudan
      // bugünkü müşterinin başlangıç şüphesinden düş.
      setStats((st) => ({ ...st, suspicion: Math.max(0, st.suspicion - RESEARCH_SUSPICION_DISCOUNT) }));
    } else if (activityId === "marketing") {
      newBossMood = clampBossMood(bossMood + MARKETING_BOSS_MOOD_BY_TIER[tier]);
      setBossMood(newBossMood);
      if (tier === 2) setStats((st) => ({ ...st, interest: Math.min(100, st.interest + MARKETING_PERFECT_INTEREST) }));
    } else if (activityId === "office-work") {
      newBonusEarnings = bonusEarnings + OFFICE_WORK_EARNINGS_BY_TIER[tier];
      setBonusEarnings(newBonusEarnings);
      const fileIdx = forgottenFileRef.current;
      forgottenFileRef.current = null;
      if (tier === 2 && fileIdx !== null && results[fileIdx]) {
        newResults = results.map((r, i) => (i === fileIdx ? { ...r, retriedLost: false, followedUpThinking: false } : r));
        setResults(newResults);
      }
    }
    persist({ results: newResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings: newBonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy: newEnergy, pendingDeliveries, bossMood: newBossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining });
  }

  function unlockSkill(skillId: string) {
    const skill = skillTree.find((s) => s.id === skillId);
    if (!skill || !canUnlockSkill(skill, ownedSkillIds, skillXP)) return;
    const newOwnedSkillIds = [...ownedSkillIds, skillId];
    const newSkillXP = skillXP - skill.cost;
    setOwnedSkillIds(newOwnedSkillIds);
    setSkillXP(newSkillXP);
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds: newOwnedSkillIds, skillXP: newSkillXP, defeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown });
  }

  // Portföy kilidi — satış/eşya/para şartlarını beklemeden bir sonraki tier'ı
  // jetonla açar. Tier perk'ü de sahiplenilir ki bir sonraki tier'ın
  // `requires` zinciri (tier3 → tier2 ...) bozulmasın.
  function skipTierWithJettons() {
    const tierPerk = perks.find((p) => p.unlocksTier === house.tier);
    if (!tierPerk || unlockedTiers.includes(house.tier)) return;
    if (getJettons() < TIER_SKIP_JETTON_COST) {
      storeReturnStageRef.current = "locked";
      setStage("store");
      return;
    }
    if (!spendJettons(TIER_SKIP_JETTON_COST)) return;
    setJettonsState(getJettons());
    const newOwned = ownedPerks.includes(tierPerk.id) ? ownedPerks : [...ownedPerks, tierPerk.id];
    const newUnlockedTiers = [...unlockedTiers, house.tier];
    setOwnedPerks(newOwned);
    setUnlockedTiers(newUnlockedTiers);
    persist({ results, weekOutcomes, badges, index, ownedPerks: newOwned, spent, consumables, unlockedTiers: newUnlockedTiers });
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
      persist({ results, weekOutcomes, badges, index, ownedPerks, spent: newSpent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy: newEnergy });
      return;
    }

    if (item.consumable) {
      if (balance < item.cost) return;
      const newConsumables = { ...consumables, [itemId]: (consumables[itemId] ?? 0) + 1 };
      const newSpent = spent + item.cost;
      setConsumables(newConsumables);
      setSpent(newSpent);
      persist({ results, weekOutcomes, badges, index, ownedPerks, spent: newSpent, consumables: newConsumables, unlockedTiers });
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

    persist({ results, weekOutcomes, badges, index, ownedPerks: newOwned, spent: newSpent, consumables, unlockedTiers: newUnlockedTiers });
  }

  function handleNegotiationChoice(choiceId: string) {
    if (!activeCallback) return;
    drainPhoneBattery();
    if (choiceId === LOW_BATTERY_CHOICE_ID) {
      const playerMsg: PhoneMessage = { from: "Emlah", text: lowBatteryLine() };
      const reactionMsg: PhoneMessage = { from: activeCallback.contactName, text: pickLowBatteryReply("customer") };
      setActiveCallback((prev) => (prev ? { ...prev, messages: [...prev.messages, playerMsg, reactionMsg], choices: undefined } : prev));
      return;
    }
    // Look up from this callback's own (tier-appropriate) choice list, not a
    // hardcoded one — luxury houses use differently-worded replies, and
    // falling back to the plain list would silently use the wrong tone.
    const choice = (activeCallback.choices ?? negotiationChoices).find((c) => c.id === choiceId);
    if (!choice) return;

    const original = results[activeCallback.resultIndex];
    const targetHouse = allHouses.find((h) => h.id === original.houseId)!;
    // "Çelişki Motoru" — a tone flip (pushy↔patient) across separate
    // negotiation attempts on the SAME customer reads as inconsistent, not
    // just a strategy change. See data/contradiction.ts.
    const toneContradiction = isToneContradiction(original.lastNegotiationTone, choice.id);
    const bias = choice.closingBias * closingBiasMultiplier(ownedPerks);
    const projected: GameStats = {
      suspicion: original.finalStats.suspicion + choice.suspicionDelta + (toneContradiction ? NEGOTIATION_TONE_CONTRADICTION_PENALTY : 0),
      interest: original.finalStats.interest + choice.interestDelta,
      fun: original.finalStats.fun + choice.funDelta,
      discountPercent: original.finalStats.discountPercent,
    };
    const outcome2: SceneOutcome = resolveOutcome(projected, bias, targetHouse.profile);

    let updatedResult: HouseResult = {
      ...original,
      finalStats: projected,
      finalSuspicion: projected.suspicion,
      lastNegotiationTone: choice.id as HouseResult["lastNegotiationTone"],
    };
    if (outcome2 === "lost") {
      updatedResult = { ...updatedResult, outcome: "lost" };
    }
    const confirmText = pickNegotiationReply(choice, outcome2);

    const newResults = results.map((r, i) => (i === activeCallback.resultIndex ? updatedResult : r));
    setResults(newResults);
    const playerMsg: PhoneMessage = { from: "Emlah", text: resolveText(choice.text) };
    const confirmMessages: PhoneMessage[] = toneContradiction
      ? [{ from: activeCallback.contactName, text: pickToneContradictionLine() }, { from: activeCallback.contactName, text: confirmText }]
      : [{ from: activeCallback.contactName, text: confirmText }];
    let newInbox = logMessages(inbox, targetHouse.id, "Emlah", [playerMsg], index + 1, true);
    newInbox = logMessages(newInbox, targetHouse.id, activeCallback.contactName, confirmMessages, index + 1);
    setInbox(newInbox);
    persist({ results: newResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox });

    if (outcome2 === "sold") {
      setPendingCallbackSale({ resultIndex: activeCallback.resultIndex, targetHouse, projectedStats: projected });
    }

    setActiveCallback((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, playerMsg, ...confirmMessages],
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
    triggerHaptic("success");

    // Patron Memnuniyeti — same discount consequence as any other sale.
    const angry = projectedStats.discountPercent > DISCOUNT_ANGER_THRESHOLD;
    const newBossMood = clampBossMood(bossMood + bossMoodDeltaForSale(projectedStats.discountPercent));
    let newInbox = inbox;
    if (angry) {
      newInbox = logMessages(newInbox, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: pickDiscountAngerLine() }], index + 1);
    }
    setBossMood(newBossMood);
    if (newInbox !== inbox) setInbox(newInbox);

    persist({ results: newResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries: newPendingDeliveries, bossMood: newBossMood });
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
            {
              from: contactName,
              text: t({
                tr: `Merhaba, ${targetHouse.title} hakkında ailemizle tekrar konuştuk.`,
                en: `Hi, we talked it over with the family again about ${targetHouse.title}.`,
              }),
            },
            {
              from: contactName,
              text: t({
                tr: "Bu ölçekte bir karar bizim için kolay değil, ama bir şansımız daha olsun istedik.",
                en: "A decision at this scale isn't easy for us, but we wanted to give it one more shot.",
              }),
            },
          ]
        : [
            {
              from: contactName,
              text: t({
                tr: `Merhaba, ${targetHouse.title} hakkında tekrar sizinle konuşmak istedim.`,
                en: `Hi, I wanted to talk with you again about ${targetHouse.title}.`,
              }),
            },
            {
              from: contactName,
              text: t({ tr: "Belki bir şansımız daha vardır diye düşündüm.", en: "I thought maybe we had one more chance." }),
            },
          ];
    const newInbox = logMessages(inbox, houseId, contactName, openingMessages, index + 1);
    setInbox(newInbox);
    persist({ results: updatedResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox });

    setActiveCallback({
      resultIndex,
      contactName,
      messages: openingMessages,
      choices: targetHouse.tier >= 3 ? luxuryNegotiationChoices : negotiationChoices,
      sessionKey: `retry-${houseId}-${Date.now()}`,
    });
    drainPhoneBattery();
    setShowEmlahMenu(false);
    setStage("callback");
  }

  function followUpThinking(houseId: string) {
    const resultIndex = results.findIndex((r) => r.houseId === houseId);
    if (resultIndex === -1) return;
    const result = results[resultIndex];
    if (result.outcome !== "thinking" || result.followedUpThinking) return;
    const targetHouse = allHouses.find((h) => h.id === houseId);
    if (!targetHouse) return;
    const contactName = resolveCustomerNames(targetHouse, castAssignment)[0];

    const reaction = rollFollowUpReaction(result.finalStats);
    const openingMsg: PhoneMessage = { from: "Emlah", text: pickEmlahFollowUpLine() };
    const replyMsg: PhoneMessage = { from: contactName, text: pickFollowUpReply(reaction) };
    let newInbox = logMessages(inbox, houseId, "Emlah", [openingMsg], index + 1, true);
    newInbox = logMessages(newInbox, houseId, contactName, [replyMsg], index + 1);
    setInbox(newInbox);

    if (reaction === "instant-lost") {
      const updatedResults = results.map((r, i) => (i === resultIndex ? { ...r, outcome: "lost" as SceneOutcome, followedUpThinking: true } : r));
      setResults(updatedResults);
      persist({ results: updatedResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox });
      return;
    }

    const nudgedStats: GameStats = {
      ...result.finalStats,
      suspicion: Math.max(0, result.finalStats.suspicion + (reaction === "warm" ? FOLLOWUP_WARM_SUSPICION_DELTA : FOLLOWUP_ANNOYED_SUSPICION_DELTA)),
      interest: Math.max(0, result.finalStats.interest + (reaction === "warm" ? FOLLOWUP_WARM_INTEREST_DELTA : FOLLOWUP_ANNOYED_INTEREST_DELTA)),
    };
    const updatedResults = results.map((r, i) => (i === resultIndex ? { ...r, finalStats: nudgedStats, followedUpThinking: true } : r));
    setResults(updatedResults);
    persist({ results: updatedResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox });

    setActiveCallback({
      resultIndex,
      contactName,
      messages: [openingMsg, replyMsg],
      choices: targetHouse.tier >= 3 ? luxuryNegotiationChoices : negotiationChoices,
      sessionKey: `followup-${houseId}-${Date.now()}`,
    });
    drainPhoneBattery();
    setShowEmlahMenu(false);
    setStage("callback");
  }

  /** "Evi Gez / Ofise Dön" — the choice shown right after today's job intro finishes typing. */
  function handleIntroChoice(choiceId: string) {
    if (choiceId === "visit" || !house) {
      activeVisitMetaRef.current = {};
      afterIntro();
      return;
    }
    // "office" — defer the visit instead of touring now.
    const contactName = resolveCustomerNames(house, castAssignment)[0];
    const newPausedVisit: PausedVisit = { houseId: house.id, contactName, status: "office" };
    setPausedVisit(newPausedVisit);
    setShowPhoneOverlay(false);
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries, pendingCallbacks, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown, pausedVisit: newPausedVisit });
  }

  /**
   * İşler — "Şimdi Git". Eskiden %40/%30/%30'luk bir zar atılıyordu (ve
   * "müsait değil" dalı aynı evi sonra yine "Bugünün İşini Al"a geri
   * koyuyordu); artık oyuncunun kararı neyse o olur.
   */
  function handleGoNowPausedVisit() {
    if (!pausedVisit || pausedVisit.status !== "office") return;
    // Normal "Bugünün İşini Al" ile aynı enerji kapısı — arada aktivite yapılmış olabilir.
    const entryCost = pausedVisit.introDone ? ENERGY_DEPLETION_PER_HOUSE : 0;
    if (energy < ENERGY_WORK_MIN_THRESHOLD) {
      setShowIsler(false);
      setShowEnergyBreak(true);
      return;
    }
    const visit = pausedVisit;
    const applyPenalty = !!visit.postponed && !visit.penaltyApplied;
    activeVisitMetaRef.current = { postponed: visit.postponed, penaltyApplied: visit.penaltyApplied || applyPenalty };
    setPausedVisit(null);
    setPausedVisitOffer(null);
    setShowIsler(false);
    if (applyPenalty) setStats((st) => ({ ...st, suspicion: st.suspicion + POSTPONE_SUSPICION_PENALTY }));
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, pendingDeliveries, pendingCallbacks, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown, energy, pausedVisit: null });
    if (visit.introDone) {
      // Hazırlık (düello/easter egg zarları vb.) zaten yapılmıştı — sadece iade edilen enerjiyi tekrar düş ve kapıya dön.
      lastHouseEnergyCostRef.current = Math.min(energy, entryCost);
      setEnergy((e) => Math.max(0, e - entryCost));
      setStage("house");
      return;
    }
    afterIntro();
  }

  /** İşler — "Ertele": müşteri 1-3 gün sonrası için bir tarih önerir. Her iş en fazla bir kez. */
  function handlePostponePausedVisit() {
    if (!pausedVisit || pausedVisit.status !== "office" || pausedVisit.postponed) return;
    setPausedVisitOffer({ daysOffset: 1 + Math.floor(Math.random() * 3) });
  }

  /** Müşterinin önerdiği tarih — kabul edilirse randevu kurulur, "Geri" ile karar kartına dönülür (iş kaybolmaz). */
  function handleRescheduleResponse(accept: boolean) {
    if (!pausedVisit || !pausedVisitOffer) return;
    setPausedVisitOffer(null);
    if (!accept) return;
    const newPausedVisit: PausedVisit = { ...pausedVisit, status: "scheduled", daysRemaining: pausedVisitOffer.daysOffset, postponed: true };
    setPausedVisit(newPausedVisit);
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, pendingDeliveries, pendingCallbacks, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown, energy, pausedVisit: newPausedVisit });
  }

  /** İşler — "Reddet": iş hiç gezilmeden kapanır, sıradaki eve geçilir (sonuç ekranı + normal ilerleme akışı). */
  function handleDeclinePausedVisit() {
    if (!pausedVisit) return;
    setPausedVisit(null);
    setPausedVisitOffer(null);
    setShowIsler(false);
    finalizeResult("lost", 0, undefined, { declined: true });
  }

  /** Kapı ekranı — "Vazgeç, İşler'e dön": ev bekleyen işe döner, harcanan enerji iade edilir. */
  function handleBackOutOfSale() {
    if (stage !== "house" || saleIntroConfirmed) return;
    const refund = lastHouseEnergyCostRef.current;
    lastHouseEnergyCostRef.current = 0;
    const newEnergy = Math.min(ENERGY_MAX, energy + refund);
    const meta = activeVisitMetaRef.current;
    const contactName = resolveCustomerNames(house, castAssignment)[0];
    const newPausedVisit: PausedVisit = {
      houseId: house.id,
      contactName,
      status: "office",
      introDone: true,
      ...(meta.postponed ? { postponed: true } : {}),
      ...(meta.penaltyApplied ? { penaltyApplied: true } : {}),
    };
    setEnergy(newEnergy);
    setPausedVisit(newPausedVisit);
    setShowPhoneOverlay(false);
    setStage("phone");
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, pendingDeliveries, pendingCallbacks, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown, energy: newEnergy, pausedVisit: newPausedVisit });
  }

  function afterIntro() {
    // Independent, non-interrupting ambient side effects — market news (a
    // banner, not a phone message) and tipster pings (a passive inbox log)
    // never touch `stage`, so they can't collide with anything below.
    if (isInvestmentUnlocked(rankTitle(earned))) {
      if (Math.random() < NEWS_CHANCE) {
        const news = pickMarketNews(activeNewsId ?? undefined);
        setActiveNewsId(news.id);
        persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId: news.id });
      }
      if (Math.random() < TIPSTER_CHANCE) {
        const tip = pickTipsterMessage(lastTipsterId);
        setLastTipsterId(tip.id);
        const threadId = `tipster-${tip.from.toLowerCase().replace(/\s+/g, "-")}`;
        setInbox((prev) => logMessages(prev, threadId, tip.from, [{ from: tip.from, text: resolveText(tip.text) }], index + 1));
      }
    }
    // "İkinci Şans" — a surprise, unprompted version of the existing manual
    // "Tekrar Dene" flow. Fires at most once per game; just drops a message
    // into that lost house's existing inbox thread — the player still has
    // to open it and pick "Tekrar Dene" themselves, so it never touches
    // `stage`. See data/secondChanceEvent.ts.
    if (!secondChanceOffered && index >= SECOND_CHANCE_MIN_INDEX && Math.random() < SECOND_CHANCE_CHANCE) {
      const candidateIdx = pickSecondChanceCandidateIndex(results);
      if (candidateIdx !== null) {
        const targetHouse = allHouses.find((h) => h.id === results[candidateIdx].houseId);
        if (targetHouse) {
          const contactName = resolveCustomerNames(targetHouse, castAssignment)[0];
          const newInbox = logMessages(inbox, targetHouse.id, contactName, [{ from: contactName, text: pickSecondChanceLine() }], index + 1);
          setInbox(newInbox);
          setSecondChanceOffered(true);
          persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown, secondChanceOffered: true });
        }
      }
    }
    // "Herkese Aynı Şeyi mi Söylüyorsun?" — a one-time narrative nudge if
    // bond points are being spread thin across 3+ friends at once with none
    // reaching Yakınlık. No bond penalty (that'd feel punishing/confusing),
    // just a values-compass tick — reuses the same tally handleToneChoice
    // already maintains. See data/relationshipStages.ts.
    if (!breadthConfrontationShown) {
      const atGuvenOrAbove = Object.entries(friendBondCounts).filter(([, count]) => count >= 3);
      if (atGuvenOrAbove.length >= BREADTH_CONFRONTATION_MIN_FRIENDS && !atGuvenOrAbove.some(([, count]) => count >= 10)) {
        const [confrontingFriendId] = atGuvenOrAbove[Math.floor(Math.random() * atGuvenOrAbove.length)];
        const friend = friendCharacters.find((f) => f.id === confrontingFriendId);
        if (friend) {
          const newInbox = logMessages(inbox, `friend-${friend.name.toLowerCase()}`, friend.name, [{ from: friend.name, text: breadthConfrontationLine(friend.name) }], index + 1);
          setInbox(newInbox);
          setBreadthConfrontationShown(true);
          setCompassTally((prev) => ({ ...prev, kurnazlik: prev.kurnazlik + 1 }));
          persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally: { ...compassTally, kurnazlik: compassTally.kurnazlik + 1 }, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown, secondChanceOffered, pendingFriendFavors, friendFavorAccepted, breadthConfrontationShown: true });
        }
      }
    }
    // "Tam Çember" — a one-time closure message from Fırat Bey once the
    // WHOLE rival ladder is cleared, not just his own early defeat. Fires
    // unconditionally the first house-transition after the condition is
    // met (no random roll — this is a guaranteed payoff for a real
    // milestone, not ambient flavor). See data/rivalCharacter.ts.
    if (!firatFullCircleShown && defeatedRivalIds.length >= rivalLadder.length) {
      const newInbox = logMessages(
        inbox,
        "rival-firat",
        "Fırat Bey",
        firatFullCircleLines.map((text) => ({ from: "Fırat Bey", text: resolveText(text) })),
        index + 1,
      );
      setInbox(newInbox);
      setFiratFullCircleShown(true);
      persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown, secondChanceOffered, pendingFriendFavors, friendFavorAccepted, breadthConfrontationShown, firatFullCircleShown: true });
    }
    // Canlı Şehir Nabzı — ambient office-radio toast, entirely independent
    // of stage/detour screens (it floats over whatever's already on
    // screen), so it never needs a hadWorkTaskThisTransition-style guard.
    if (Math.random() < CITY_PULSE_CHANCE) {
      const lastSold = [...results].reverse().find((r) => r.outcome === "sold" && r.sale);
      const lastSoldHouse = lastSold ? allHouses.find((h) => h.id === lastSold.houseId) : undefined;
      setCityPulseMsg(
        pickCityPulseLine({
          lastSaleAmount: lastSold?.sale?.commission,
          lastSaleDistrict: lastSoldHouse ? districtOf(lastSoldHouse.location) : undefined,
          soldCount: results.filter((r) => r.outcome === "sold").length,
          rivalTotal: rivalTotalSales(weekOutcomes.length),
          bossMoodHigh: bossMood >= 75,
        }),
      );
    }
    // Two more independent, silent flags for the upcoming house — neither
    // touches `stage`, and both resolve entirely within finalizeResult()
    // once that house's outcome is known, so they can't collide with
    // anything below or leave a dangling state across house visits.
    if (Math.random() < RIVAL_DUEL_CHANCE) {
      setActiveDuelHouseId(house.id);
      const activeRival = activeRivalFor(defeatedRivalIds);
      // Only Fırat Bey (ladder rung 1) has the richer in-dialogue mood
      // encounter — other rivals still fire the same bonus-only duel via
      // the inbox heads-up + small tag, just without the face-to-face scene.
      setActiveFiratMood(
        activeRival.id === "firat"
          ? firatMoodFor(results.filter((r) => r.outcome === "sold").length, rivalTotalSales(weekOutcomes.length))
          : null,
      );
      const duelMsg: PhoneMessage = { from: "Muzaffer Bey", text: pickDuelStartMessage(resolveHouseTitle(house), activeRival.name) };
      setInbox((prev) => logMessages(prev, "muzaffer", "Muzaffer Bey", [duelMsg], index + 1));
    } else if (Math.random() < MYSTERY_SHOPPER_CHANCE) {
      // Deliberately silent — a mystery shopper who announced themselves wouldn't be much of a mystery.
      setMysteryShopperHouseId(house.id);
    } else if (Math.random() < EASTER_EGG_CHANCE) {
      const egg = pickEasterEgg(lastEasterEggId);
      setLastEasterEggId(egg.id);
      setActiveEasterEgg({ houseId: house.id, egg });
      sq.onEasterEggShown(egg.id);
      setEasterEggsSeenCount((c) => c + 1);
      triggerHaptic("light");
    } else if (!realWorldFlavorShownRef.current && Math.random() < REAL_WORLD_FLAVOR_CHANCE) {
      const line = pickRealWorldFlavorLine();
      if (line) {
        realWorldFlavorShownRef.current = true;
        setInbox((prev) => logMessages(prev, "muzaffer", "Muzaffer Bey", [{ from: "Muzaffer Bey", text: line }], index + 1));
      }
    } else if (Math.random() < MEMORY_REFERENCE_CHANCE) {
      const memory = pickEligibleMemory(significantMemories, index);
      if (memory) {
        setActiveMemoryReference({ houseId: house.id, memory });
        // Consumed on use — otherwise the same (still-oldest) memory would
        // just keep getting referenced forever instead of cycling through.
        setSignificantMemories(consumeMemory(significantMemories, memory.id));
        // "Reputation precedes you" — a small, one-off starting-suspicion
        // nudge for the customer we're about to walk in on.
        const nudge = memoryReputationSuspicionNudge(memory.kind);
        if (nudge !== 0) setStats((s) => ({ ...s, suspicion: Math.max(0, s.suspicion + nudge) }));
      }
    }
    // Emlah'ın Enerjisi — depletes a fixed amount per house walked into.
    // Harcanan miktar saklanır ki kapıdan "Vazgeç" ile dönülürse aynen iade edilsin.
    lastHouseEnergyCostRef.current = Math.min(energy, ENERGY_DEPLETION_PER_HOUSE);
    setEnergy((e) => Math.max(0, e - ENERGY_DEPLETION_PER_HOUSE));
    if (index === 0) {
      setStage("house");
      return;
    }
    // Single roll picks at most one extra exchange, so friend messages and
    // boss chitchat never both fire for the same house visit. Additionally
    // skipped entirely when an office-task-family screen already fired this
    // same transition (hadWorkTaskThisTransition) — this is what keeps the
    // two detour families from ever stacking into two screens in a row; the
    // friend/chitchat system's own long-run frequency is untouched, it just
    // never doubles up with a task screen on the same house.
    if (!hadWorkTaskThisTransition) {
      const roll = Math.random();
      if (roll < FRIEND_CHANCE) {
        const set = pickFriendMessage(lastFriendId, pendingLoan !== null, pendingInvestment !== null, unlockedFriendHouseIds);
        setLastFriendId(set.id);
        const openMsg: PhoneMessage[] = [{ from: set.contactName, text: resolveText(set.prompt) }];
        setActiveFriendChat({ set, messages: openMsg, showChoices: true });
        const threadId = `friend-${set.contactName.toLowerCase()}`;
        setInbox((prev) => logMessages(prev, threadId, set.contactName, openMsg, index + 1));
        setStage("chitchat");
        return;
      }
      if (roll < FRIEND_CHANCE + CHITCHAT_CHANCE) {
        const set = pickChitchat(lastChitchatId);
        setLastChitchatId(set.id);
        const openMsg: PhoneMessage[] = [{ from: "Muzaffer Bey", text: resolveText(set.prompt) }];
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
    }
    setStage("house");
  }

  function handleFriendChoice(choiceId: string) {
    if (!activeFriendChat) return;
    drainPhoneBattery();
    if (choiceId === LOW_BATTERY_CHOICE_ID) {
      const playerMsg: PhoneMessage = { from: "Emlah", text: lowBatteryLine() };
      const reactionMsg: PhoneMessage = { from: activeFriendChat.set.contactName, text: pickLowBatteryReply("casual") };
      setActiveFriendChat((prev) => (prev ? { ...prev, messages: [...prev.messages, playerMsg, reactionMsg], showChoices: false } : prev));
      return;
    }
    const choice = activeFriendChat.set.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    const threadId = `friend-${activeFriendChat.set.contactName.toLowerCase()}`;
    const replyMsg: PhoneMessage = { from: "Emlah", text: resolveText(choice.text) };

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

    let newUnlockedFriendHouseIds = unlockedFriendHouseIds;
    let newFriendBondCounts = friendBondCounts;
    let newFriendBondMilestonesShown = friendBondMilestonesShown;
    let newPendingFriendFavors = pendingFriendFavors;
    let houseTipReaction = resolveText(choice.reaction);
    // Bagged up here instead of a separate racing setInbox() call — the
    // milestone/favor message used to be posted via its own functional
    // setInbox() update that the direct setInbox(newInbox) below silently
    // clobbered in the same tick (never actually visible). Folding it into
    // the SAME newInbox chain both fixes that and lets the favor prompt
    // land right alongside the milestone line.
    let milestoneMessages: PhoneMessage[] = [];
    let milestoneFriendName: string | null = null;
    let newEnergy = energy;
    if (choice.houseTipAction === "accept" && choice.houseTipHouseId && !unlockedFriendHouseIds.includes(choice.houseTipHouseId)) {
      newUnlockedFriendHouseIds = [...unlockedFriendHouseIds, choice.houseTipHouseId];
      setUnlockedFriendHouseIds(newUnlockedFriendHouseIds);
      newEnergy = Math.max(0, energy - FRIEND_TIP_ENERGY_COST);
      setEnergy(newEnergy);
      const apptIndex = index + (choice.houseTipWeekOffset ?? 0) * HOUSES_PER_WEEK;
      const dateLabel = formatGameDate(gameDateForIndex(apptIndex));
      houseTipReaction = `${resolveText(choice.reaction)} (Randevu: ${dateLabel} — "Arkadaşlarım" menüsünden bakabilirsin. -${FRIEND_TIP_ENERGY_COST} enerji)`;

      // "İlişki Evreleri" — see data/relationshipStages.ts. Milestone 3
      // (Güven) now also opens a real favor choice; milestone 10
      // (Yakınlık) gets an upgraded epilogue if that favor was accepted.
      const friend = friendCharacterForHouseId(choice.houseTipHouseId);
      if (friend) {
        const newCount = (friendBondCounts[friend.id] ?? 0) + 1;
        newFriendBondCounts = { ...friendBondCounts, [friend.id]: newCount };
        setFriendBondCounts(newFriendBondCounts);
        if (FRIEND_BOND_MILESTONES.includes(newCount)) {
          const milestoneKey = `${friend.id}-${newCount}`;
          if (!friendBondMilestonesShown.includes(milestoneKey)) {
            newFriendBondMilestonesShown = [...friendBondMilestonesShown, milestoneKey];
            setFriendBondMilestonesShown(newFriendBondMilestonesShown);
            milestoneFriendName = friend.name;
            const line = friendBondMilestoneLine(friend.name, newCount);
            if (line) milestoneMessages.push({ from: friend.name, text: line });
            if (newCount === 3) {
              newPendingFriendFavors = { ...pendingFriendFavors, [friend.id]: true };
              setPendingFriendFavors(newPendingFriendFavors);
              milestoneMessages.push({ from: friend.name, text: favorRequestLine(friend.name, resolveText(friend.profession)) });
            } else if (newCount === 10 && friendFavorAccepted[friend.id]) {
              milestoneMessages.push({ from: friend.name, text: yakinlikEpilogueLine(friend.name) });
            }
          }
        }
      }
    }

    let newBonusEarnings = bonusEarnings;
    let bulkDealReaction = houseTipReaction;
    if (choice.bulkDealAction === "safe") {
      newBonusEarnings = bonusEarnings + BULK_DEAL_SAFE_AMOUNT;
      setBonusEarnings(newBonusEarnings);
      bulkDealReaction = `${resolveText(choice.reaction)} (+${formatTL(BULK_DEAL_SAFE_AMOUNT)})`;
    } else if (choice.bulkDealAction === "risky") {
      const big = Math.random() < BULK_DEAL_RISKY_BIG_CHANCE;
      const amount = big ? BULK_DEAL_RISKY_BIG_AMOUNT : BULK_DEAL_RISKY_SMALL_AMOUNT;
      newBonusEarnings = bonusEarnings + amount;
      setBonusEarnings(newBonusEarnings);
      bulkDealReaction = big
        ? t({ tr: `Anlaşma büyük çıktı, payınız: +${formatTL(amount)}`, en: `The deal came in big, your share: +${formatTL(amount)}` })
        : t({
            tr: `Anlaşma beklediğimizden küçük oldu ama yine de bir pay çıktı: +${formatTL(amount)}`,
            en: `The deal came in smaller than expected, but you still got a share: +${formatTL(amount)}`,
          });
    }

    const reactionMsg: PhoneMessage = { from: activeFriendChat.set.contactName, text: bulkDealReaction };
    let newInbox = logMessages(inbox, threadId, "Emlah", [replyMsg], index + 1, true);
    newInbox = logMessages(newInbox, threadId, activeFriendChat.set.contactName, [reactionMsg], index + 1);
    if (milestoneMessages.length > 0 && milestoneFriendName) {
      newInbox = logMessages(newInbox, `friend-${milestoneFriendName.toLowerCase()}`, milestoneFriendName, milestoneMessages, index + 1);
    }
    setInbox(newInbox);
    setActiveFriendChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, replyMsg, reactionMsg], showChoices: false } : prev,
    );
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent: newSpent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings: newBonusEarnings, pendingLoan: newPendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment: newPendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy: newEnergy, pendingDeliveries, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds: newUnlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts: newFriendBondCounts, friendBondMilestonesShown: newFriendBondMilestonesShown, flashbackShown, secondChanceOffered, pendingFriendFavors: newPendingFriendFavors, friendFavorAccepted, breadthConfrontationShown });
  }

  function resolveFriendFavor(friendId: string, accepted: boolean) {
    if (!pendingFriendFavors[friendId]) return;
    const friend = friendCharacters.find((f) => f.id === friendId);
    if (!friend) return;

    const newPendingFriendFavors = { ...pendingFriendFavors };
    delete newPendingFriendFavors[friendId];
    setPendingFriendFavors(newPendingFriendFavors);

    let newSpent = spent;
    let newFriendFavorAccepted = friendFavorAccepted;
    let newFriendBondCounts = friendBondCounts;
    const replyMsg: PhoneMessage = {
      from: friend.name,
      text: accepted ? favorAcceptReply(friend.name) : favorDeclineReply(friend.name),
    };
    if (accepted) {
      newSpent = spent + FAVOR_ACCEPT_COST;
      setSpent(newSpent);
      newFriendFavorAccepted = { ...friendFavorAccepted, [friendId]: true };
      setFriendFavorAccepted(newFriendFavorAccepted);
      newFriendBondCounts = { ...friendBondCounts, [friendId]: (friendBondCounts[friendId] ?? 0) + FAVOR_ACCEPT_BOND_BONUS };
      setFriendBondCounts(newFriendBondCounts);
    }

    const threadId = `friend-${friend.name.toLowerCase()}`;
    const newInbox = logMessages(inbox, threadId, friend.name, [replyMsg], index + 1);
    setInbox(newInbox);
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent: newSpent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts: newFriendBondCounts, friendBondMilestonesShown, flashbackShown, secondChanceOffered, pendingFriendFavors: newPendingFriendFavors, friendFavorAccepted: newFriendFavorAccepted, breadthConfrontationShown });
  }

  /** "Zor Zamanlar" — the reverse of resolveFriendFavor: Emlah reaches out to a Güven+ friend when genuinely struggling. Eligibility is fully derived (no persisted "pending" state needed) — see hardTimesEligibleFriendIds below. */
  function resolveHardTimesAsk(friendId: string) {
    if (hardTimesUsed[friendId]) return;
    const friend = friendCharacters.find((f) => f.id === friendId);
    if (!friend) return;
    const count = friendBondCounts[friendId] ?? 0;
    if (count < HARD_TIMES_BOND_THRESHOLD) return;

    const newHardTimesUsed = { ...hardTimesUsed, [friendId]: true };
    setHardTimesUsed(newHardTimesUsed);

    const stage = stageForBondCount(count);
    const reward = hardTimesReward(stage);
    const newBonusEarnings = bonusEarnings + reward.bonusEarnings;
    const newEnergy = Math.min(ENERGY_MAX, energy + reward.energy);
    const newBossMood = clampBossMood(bossMood + reward.bossMood);
    setBonusEarnings(newBonusEarnings);
    setEnergy(newEnergy);
    setBossMood(newBossMood);
    const newFriendBondCounts = { ...friendBondCounts, [friendId]: count + HARD_TIMES_BOND_BONUS };
    setFriendBondCounts(newFriendBondCounts);

    const askMsg: PhoneMessage = { from: "Emlah", text: hardTimesAskLine(friend.name) };
    const replyMsg: PhoneMessage = { from: friend.name, text: hardTimesReplyLine(friend.name, stage) };
    const threadId = `friend-${friend.name.toLowerCase()}`;
    let newInbox = logMessages(inbox, threadId, "Emlah", [askMsg], index + 1, true);
    newInbox = logMessages(newInbox, threadId, friend.name, [replyMsg], index + 1);
    setInbox(newInbox);

    persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings: newBonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy: newEnergy, pendingDeliveries, bossMood: newBossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP, defeatedRivalIds, friendBondCounts: newFriendBondCounts, friendBondMilestonesShown, flashbackShown, secondChanceOffered, pendingFriendFavors, friendFavorAccepted, breadthConfrontationShown, firatFullCircleShown, hardTimesUsed: newHardTimesUsed });
  }

  function handleMeetupChoice(activityId: string) {
    if (!activeMeetup) return;
    drainPhoneBattery();
    if (activityId === LOW_BATTERY_CHOICE_ID) {
      const playerMsg: PhoneMessage = { from: "Emlah", text: lowBatteryLine() };
      const reactionMsg: PhoneMessage = { from: activeMeetup.characterName, text: pickLowBatteryReply("casual") };
      setActiveMeetup((prev) => (prev ? { ...prev, messages: [...prev.messages, playerMsg, reactionMsg], showChoices: false } : prev));
      return;
    }
    const activity = meetupActivities.find((a) => a.id === activityId);

    const threadId = `meetup-${activeMeetup.characterId}`;
    const replyMsg: PhoneMessage = {
      from: "Emlah",
      text: activity ? resolveText(activity.label) : t({ tr: "Şu an vaktim yok açıkçası.", en: "I honestly don't have time right now." }),
    };

    let newSpent = spent;
    let newFriendBonds = friendBonds;
    let reactionText: string;

    if (!activity) {
      reactionText = resolveText(declineReplies[Math.floor(Math.random() * declineReplies.length)]);
    } else if (balance >= activity.cost) {
      newSpent = spent + activity.cost;
      setSpent(newSpent);
      newFriendBonds = { ...friendBonds, [activeMeetup.characterId]: activity.bondGain };
      setFriendBonds(newFriendBonds);
      setPendingMeetupBonus(activity.bonus);
      reactionText = resolveText(activity.goodReplies[Math.floor(Math.random() * activity.goodReplies.length)]);
    } else {
      newFriendBonds = { ...friendBonds, [activeMeetup.characterId]: 0 };
      setFriendBonds(newFriendBonds);
      reactionText = resolveText(activity.cantAffordReplies[Math.floor(Math.random() * activity.cantAffordReplies.length)]);
    }

    const reactionMsg: PhoneMessage = { from: activeMeetup.characterName, text: reactionText };
    const withReply = logMessages(inbox, threadId, "Emlah", [replyMsg], index + 1, true);
    const newInbox = logMessages(withReply, threadId, activeMeetup.characterName, [reactionMsg], index + 1);
    setInbox(newInbox);
    setActiveMeetup((prev) =>
      prev ? { ...prev, messages: [...prev.messages, replyMsg, reactionMsg], showChoices: false } : prev,
    );
    persist({ results, weekOutcomes, badges, index, ownedPerks, spent: newSpent, consumables, unlockedTiers, houseOrder, inbox: newInbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds: newFriendBonds });
  }

  function handleChitchatChoice(choiceId: string) {
    if (!activeChitchat) return;
    drainPhoneBattery();
    if (choiceId === LOW_BATTERY_CHOICE_ID) {
      const playerMsg: PhoneMessage = { from: "Emlah", text: lowBatteryLine() };
      const reactionMsg: PhoneMessage = { from: "Muzaffer Bey", text: pickLowBatteryReply("casual") };
      setActiveChitchat((prev) => (prev ? { ...prev, messages: [...prev.messages, playerMsg, reactionMsg], showChoices: false } : prev));
      return;
    }
    const choice = activeChitchat.set.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    const replyMsg: PhoneMessage = { from: "Emlah", text: resolveText(choice.text) };
    const reactionMsg: PhoneMessage = { from: "Muzaffer Bey", text: resolveText(choice.reaction) };

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
  useEffect(() => {
    const soldCount = results.filter((r) => r.outcome === "sold").length;
    if (soldCount >= 1) unlockAchievement(ACHIEVEMENT_IDS.firstSale);
    if (soldCount >= 1 && !isFullUnlocked()) {
      try {
        if (localStorage.getItem("simsar-emlak-starter-promo-shown") !== "1") {
          localStorage.setItem("simsar-emlak-starter-promo-shown", "1");
          setStarterPromoPopup(true);
        }
      } catch {
        // ignore
      }
    }
    if (soldCount >= 10) unlockAchievement(ACHIEVEMENT_IDS.tenSales);
    if (soldCount >= 20 && Object.keys(friendBondCounts).length === 0) unlockAchievement(ACHIEVEMENT_IDS.loneWolf20);
    if (earned >= 10_000_000) unlockAchievement(ACHIEVEMENT_IDS.totalEarnings10M);
    if (earned >= 1_500_000) unlockAchievement(ACHIEVEMENT_IDS.topRank);
    if (bossMood >= 100) unlockAchievement(ACHIEVEMENT_IDS.bossMoodMax);
    if (defeatedRivalIds.includes("firat")) unlockAchievement(ACHIEVEMENT_IDS.beatFirat);
    if (defeatedRivalIds.length >= rivalLadder.length) unlockAchievement(ACHIEVEMENT_IDS.allRivalsBeaten);
    if (Object.values(friendBondCounts).filter((c) => c >= 10).length >= 3) unlockAchievement(ACHIEVEMENT_IDS.threeFriendsYakinlik);
    if (investmentResults.some((r) => r.outcome === "sold")) unlockAchievement(ACHIEVEMENT_IDS.firstInvestmentFlip);
    if (secondChanceOffered) unlockAchievement(ACHIEVEMENT_IDS.secondChanceUsed);
    // "Dürüst Emlakçı" — finish any week averaging under 20% suspicion.
    if (weekOutcomes.some((w) => w.avgSuspicion < 20)) unlockAchievement(ACHIEVEMENT_IDS.honestWeek);
    // "Mahalle Fatihi" — fully dominate any single district.
    const districtPinsForAchievements = buildDistrictPins(results, premiumResults, investmentResults, friendHouseResults);
    if (districtPinsForAchievements.some((p) => p.dominated)) unlockAchievement(ACHIEVEMENT_IDS.districtDominance);
    // "Gece Kuşu" — try every mini-game at least once.
    if (hasPlayedAllMinigames(energyBreakActivities.map((a) => a.id))) unlockAchievement(ACHIEVEMENT_IDS.triedAllMinigames);
    submitLeaderboardScore(earned);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, earned, bossMood, defeatedRivalIds, friendBondCounts, investmentResults, secondChanceOffered, weekOutcomes, premiumResults, friendHouseResults]);
  const anySold = results.some((r) => r.outcome === "sold");
  // "Zor Zamanlar" — eligibility is fully derived, no persisted "pending" flag needed.
  const recentLossStreak =
    results.length >= HARD_TIMES_LOSS_STREAK &&
    results.slice(-HARD_TIMES_LOSS_STREAK).every((r) => r.outcome === "lost" && !r.declined);
  const emlahStruggling = bossMood < HARD_TIMES_BOSS_MOOD_THRESHOLD || recentLossStreak;
  // ---------------- Yan görevler & easter egg paketi (hooks/useSideQuests.ts) ----------------
  const sq = useSideQuests({
    stage,
    index,
    houseOrder,
    allHouses,
    castAssignment,
    origin,
    setInbox,
    setBonusEarnings,
    setBossMood,
    setStats,
    setEnergy,
    energy,
    awardBadge: (id) => {
      const badge = allBadges[id];
      if (!badge) return;
      setBadges((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setBadgeCelebration([badge]);
    },
    grantJettons: (amount) => {
      addJettons(amount);
      setJettonsState(getJettons());
    },
    openSecretHouse: (id) => setActiveSecretHouseId(id),
    showToast: (text) => setSideToast(text),
  });
  sideQuestsRef.current = sq.state;
  // Yan görev durumu değişince kayda sessizce yaz — persist() bir sonraki kayıtta da taşır.
  useEffect(() => {
    if (stage === "menu" || stage === "saved" || stage === "setup" || stage === "origin") return;
    patchSave(activeSlot, { sideQuests: sq.state });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sq.state]);
  useEffect(() => {
    if (!sideToast) return;
    const timer = setTimeout(() => setSideToast(null), 3200);
    return () => clearTimeout(timer);
  }, [sideToast]);
  useEffect(() => {
    if (!cityPulseMsg) setRadioSecret(false);
  }, [cityPulseMsg]);
  // Ziyaret başına sabit — her render'da yeniden karıştırılmasın (DialogueScene memo'su nodeId'ye bağlı).
  const sideDialogue = useMemo(
    () => (house ? sq.dialogueFor(house, index) : { choices: [] }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [house?.id, index, sq.state.lastTick],
  );
  // B3 — Tapu Masası her açıldığında bir kez zar atılır.
  const tapuSigner = useMemo(
    () => (activeActivityGame === "office-work" ? sq.rollTapuSigner(contactedCustomers.map((c) => c.name).filter(Boolean)) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeActivityGame],
  );

  const unreadCount = unreadCountOf(inbox);
  /** G7 — telefon sahnelerinde oyunun üst barı gizlenir; telefon tüm ekranı kullanır. */
  const phoneSceneActive = (stage === "phone" && showPhoneOverlay) || stage === "callback" || stage === "chitchat";
  /** Ofis ekranı — alt çubuk (S1) yalnızca burada görünür; ev turunda sahne bölünmez. */
  const inOffice = stage === "phone" && !!intro && !showPhoneOverlay;

  // Telefon ekranında canlı akan sohbet zaten görülmüş sayılır — gelen
  // kutusunda "okunmamış" diye ikinci kez bağırmasın.
  const liveThreadId: string | null =
    stage === "phone" && intro && showPhoneOverlay
      ? "muzaffer"
      : stage === "callback" && activeCallback
        ? (results[activeCallback.resultIndex]?.houseId ?? null)
        : stage === "chitchat" && activeChitchat
          ? "muzaffer"
          : stage === "chitchat" && activeFriendChat
            ? `friend-${activeFriendChat.set.contactName.toLowerCase()}`
            : stage === "chitchat" && activeMeetup
              ? `meetup-${activeMeetup.characterId}`
              : null;
  useEffect(() => {
    if (liveThreadId) setInbox((prev) => markThreadRead(prev, liveThreadId));
  }, [liveThreadId, inbox]);

  // S5 — yeni gelen gerçek mesaj için bildirim. Ana menü/kayıt ekranlarında
  // ya da bir kayıt yüklenirken (toplu değişim) temel küme yeniden kurulur,
  // böylece eski mesajlar bildirim olarak patlamaz.
  const liveThreadIdRef = useRef<string | null>(null);
  liveThreadIdRef.current = liveThreadId;
  // Oyuna giriş anı (yeni oyun / kayıt yükleme) — açılışta biriken mesajlar bildirim olarak patlamasın, Telefon rozeti yeter.
  const gameEnteredAtRef = useRef(0);
  useEffect(() => {
    const known = knownMessageIdsRef.current;
    const inGame = stage !== "menu" && stage !== "saved" && stage !== "setup" && stage !== "origin";
    if (known === null || !inGame) {
      knownMessageIdsRef.current = new Set(inbox.map((m) => m.id));
      gameEnteredAtRef.current = Date.now();
      return;
    }
    if (Date.now() - gameEnteredAtRef.current < BANNER_QUIET_AFTER_ENTER_MS) {
      for (const m of inbox) known.add(m.id);
      return;
    }
    const fresh = inbox.filter((m) => !known.has(m.id));
    for (const m of fresh) known.add(m.id);
    if (fresh.length === 0 || fresh.length > 4) return;
    const candidate = [...fresh]
      .reverse()
      .find((m) => isUnread(m) && !isFlavorThread(m.threadId) && m.threadId !== liveThreadIdRef.current);
    if (!candidate) return;
    setNotificationBanner({
      key: candidate.id,
      threadId: candidate.threadId,
      name: candidate.contactName,
      text: candidate.text,
      avatarSrc: contactAvatar(candidate.contactName, allHouses.some((h) => h.id === candidate.threadId) ? candidate.threadId : undefined, castAssignment),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inbox, stage]);
  const dismissBanner = useCallback(() => setNotificationBanner(null), []);

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
      setRankUpSkillBonus(RANK_UP_SKILL_XP_BONUS);
      const newSkillXP = skillXP + RANK_UP_SKILL_XP_BONUS;
      setSkillXP(newSkillXP);
      persist({ results, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers, houseOrder, inbox, castAssignment, dailyQuest, slot: activeSlot, bonusEarnings, pendingLoan, tasksCompleted, chitchatBonuses, premiumResults, pendingInvestment, friendBonds, ownedInvestmentHouses, investmentResults, contactedCustomers, activeNewsId, energy, pendingDeliveries, bossMood, firedSeasonalEventWeeks, voiceTally, origin, compassTally, significantMemories, originChoiceCount, selfReflectionShown, unlockedFriendHouseIds, friendHouseResults, energyLastRegenAt, minigameNextAvailableAt, minigamePlaysRemaining, ownedSkillIds, skillXP: newSkillXP, defeatedRivalIds, friendBondCounts, friendBondMilestonesShown, flashbackShown, secondChanceOffered, pendingFriendFavors, friendFavorAccepted, breadthConfrontationShown, firatFullCircleShown, hardTimesUsed });
      playReward();
    }
    lastRankRef.current = currentRank;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const marketVisible = stage !== "menu" && stage !== "saved" && stage !== "settings" && stage !== "store" && stage !== "paywall";

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  if (!languageChosen) {
    return (
      <div className="game-root">
        <LanguageSelectScreen
          current={hasChosenLanguage() ? language : undefined}
          onChosen={(lang) => {
            setLanguage(lang);
            setLanguageChosen(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`game-root ${inOffice ? "game-root-with-nav" : ""}`} onClick={handleRootClick}>
      <Suspense fallback={null}>
      {marketVisible && !phoneSceneActive && (
        // S2 — tek satırlık üst bar: konum solda, bakiye/jeton/ayarlar sağda.
        // Bakiye yalnızca bilgi; jeton Mağaza'yı, dişli Ayarlar'ı açar. Emlah
        // menüsü ofisteyken alt çubukta, diğer ekranlarda buradaki düğmede.
        <header className="topbar">
          <div className="topbar-row">
            <span className="topbar-loc">
              <strong>
                {t({ tr: "Ev", en: "House" })} {(pendingHouseEntry ? pendingHouseEntry.newIndex : index) + 1}/{allHouses.length}
              </strong>
              <span className="topbar-rank">{rankTitleDisplay(rankTitle(earned))}</span>
            </span>
            <span
              className={`topbar-save ${showSavedToast ? "topbar-save-on" : ""}`}
              role="status"
              aria-label={showSavedToast ? t({ tr: "Kaydedildi", en: "Saved" }) : undefined}
            >
              <DiskIcon size={12} />
            </span>
            <span className="topbar-chip" title={t({ tr: "Bakiye", en: "Balance" })}>
              <WalletIcon size={12} className="icon-inline" /> {formatTL(balance)}
            </span>
            <button className="topbar-chip topbar-chip-btn jetton-pill" onClick={openStoreFromGame} aria-label={t({ tr: "Jeton — Mağaza", en: "Jetton — Store" })}>
              <CoinIcon size={12} className="icon-inline" /> {jettons}
            </button>
            {!inOffice && unreadCount > 0 && (
              <span className="topbar-unread" key={unreadCount} title={t({ tr: "Okunmamış mesajlar — ofiste Telefon'dan oku", en: "Unread messages — read them from Phone in the office" })}>
                <PhoneDeviceIcon size={12} className="icon-inline" /> {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            {!inOffice && (
              <button className="topbar-icon wallet-pill-btn" onClick={() => openEmlahMenu("market")} aria-label={t({ tr: "Emlah menüsü", en: "Estetan menu" })}>
                <IdCardIcon size={16} />
              </button>
            )}
            <button className="topbar-icon topbar-settings" onClick={openSettings} aria-label={t({ tr: "Ayarlar", en: "Settings" })}>
              <GearIcon size={16} />
            </button>
          </div>
          {dailyQuest && (
            <button className="topbar-quest" onClick={() => setQuestExpanded((v) => !v)} aria-expanded={questExpanded}>
              <span className="topbar-quest-label">{t({ tr: "Günün görevi", en: "Daily quest" })}</span>
              <span className="topbar-quest-title">{resolveText(dailyQuest.title)}</span>
              {questExpanded && <span className="topbar-quest-desc">{resolveText(dailyQuest.description)}</span>}
            </button>
          )}
        </header>
      )}

      {marketVisible && activeNewsId && isInvestmentUnlocked(rankTitle(earned)) && (
        <NewsBanner news={marketNews.find((n) => n.id === activeNewsId) ?? null} />
      )}

      {rankUpTitle && (
        <div className="rankup-overlay" onClick={() => setRankUpTitle(null)}>
          <div
            className="rankup-card"
            style={
              origin
                ? { borderColor: originById(origin)?.accentColor, boxShadow: `0 0 24px 4px ${originById(origin)?.accentColor}59` }
                : undefined
            }
          >
            <div className="rankup-icon-row">
              <StarIcon size={32} />
              {origin &&
                (() => {
                  const OriginIcon = originIcons[origin];
                  return <OriginIcon size={26} style={{ color: originById(origin)?.accentColor }} />;
                })()}
            </div>
            <p className="rankup-label">{t({ tr: "Yeni Rütbe!", en: "New Rank!" })}</p>
            <p className="rankup-title">{rankUpTitle ? rankTitleDisplay(rankUpTitle) : rankUpTitle}</p>
            {rankUpUnlockedInvites && (
              <p className="rankup-invite-note">
                {t({ tr: "Ününüz yayılıyor — yeni özel davetler açıldı!", en: "Your reputation is spreading — new special invites unlocked!" })}
              </p>
            )}
            {rankUpSkillBonus && (
              <p className="rankup-invite-note">
                +{rankUpSkillBonus} {t({ tr: "Deneyim Puanı kazandın!", en: "Experience Points earned!" })}
              </p>
            )}
          </div>
        </div>
      )}

      {starterPromoPopup && (
        <div className="rankup-overlay" onClick={() => setStarterPromoPopup(false)}>
          <div className="rankup-card">
            <span className="rankup-label"><GiftBundleIcon size={32} /></span>
            <p className="rankup-title">
              {language === "en" ? "Welcome Offer" : "Karşılama Teklifi"}
            </p>
            <p className="menu-empty">
              {language === "en"
                ? "Check out the Starter Bundle in the Store — the best value way to unlock the full game, with no interstitial ads."
                : "Mağaza'daki Başlangıç Paketine göz at — oyunu tam açmanın ve geçiş reklamlarından kurtulmanın en avantajlı yolu."}
            </p>
            <button
              className="pixel-btn small"
              onClick={() => {
                setStarterPromoPopup(false);
                openSettings();
              }}
            >
              {language === "en" ? "View Offers" : "Teklifleri Gör"}
            </button>
          </div>
        </div>
      )}

      {dailyRewardPopup !== null && (
        <div className="rankup-overlay" onClick={() => setDailyRewardPopup(null)}>
          <div className="rankup-card">
            <span className="rankup-label"><CoinIcon size={32} /></span>
            <p className="rankup-title">
              {language === "en" ? "Daily Login Reward" : "Günlük Giriş Ödülü"}
            </p>
            <p className="menu-empty">
              {language === "en"
                ? `+${dailyRewardPopup} Jetton for coming back today!`
                : `Bugün geri geldiğin için +${dailyRewardPopup} Jetton!`}
            </p>
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
                {resolveText(b.title)}
              </p>
            ))}
          </div>
        </div>
      )}

      {activeSelfReflection && (
        <div className="rankup-overlay" onClick={() => setActiveSelfReflection(null)}>
          <div className="rankup-card self-reflection-card">
            <p className="rankup-label">{resolveText(selfReflectionText[activeSelfReflection].title)}</p>
            {selfReflectionText[activeSelfReflection].paragraphs.map((p, i) => (
              <p className="self-reflection-paragraph" key={i}>
                {resolveText(p)}
              </p>
            ))}
          </div>
        </div>
      )}

      {activeFlashback && (
        <div className="rankup-overlay" onClick={() => setActiveFlashback(null)}>
          <div className="rankup-card self-reflection-card flashback-card">
            <p className="rankup-label">{flashbackTextFor(activeFlashback).title}</p>
            {flashbackTextFor(activeFlashback).paragraphs.map((p, i) => (
              <p className="flashback-paragraph" key={i}>
                {p}
              </p>
            ))}
          </div>
        </div>
      )}

      {activeFatefulMoment && (
        <div className="rankup-overlay" onClick={() => setActiveFatefulMoment(null)}>
          <div className="rankup-card self-reflection-card flashback-card">
            <p className="rankup-label">{activeFatefulMoment.title}</p>
            {activeFatefulMoment.paragraphs.map((p, i) => (
              <p className="flashback-paragraph" key={i}>
                {p}
              </p>
            ))}
          </div>
        </div>
      )}


      <RadioTicker
        text={cityPulseMsg}
        tappable={inOffice}
        secret={radioSecret}
        onTap={() => {
          const secret = sq.onRadioTap();
          if (secret) {
            setRadioSecret(true);
            setCityPulseMsg(secret);
          }
        }}
      />

      {sq.story && <SideStoryModal title={sq.story.title} lines={sq.story.lines} closeLabel={sq.story.closeLabel} onClose={sq.closeStory} />}

      {sideToast && (
        <div className="social-toast click-milestone-toast">
          <span className="social-toast-comment">{sideToast}</span>
        </div>
      )}

      {notificationBanner && (
        <NotificationBanner
          banner={notificationBanner}
          onDone={dismissBanner}
          onTap={() => {
            const target = notificationBanner.threadId;
            setNotificationBanner(null);
            if (inOffice) openMessagesOnly(target);
          }}
        />
      )}

      {showEnergyBreak && (
        <EnergyBreakScreen
          energy={energy}
          jettons={jettons}
          onChoose={handleEnergyBreakChoice}
          onWatchAd={handleWatchAdForEnergy}
          onSpendJettons={handleSpendJettonsForEnergy}
          onClose={() => setShowEnergyBreak(false)}
        />
      )}

      {socialReaction && (
        <div className="social-toast">
          <span className="social-toast-likes"><HeartIcon size={12} className="icon-inline" /> {socialReaction.likes}</span>
          <span className="social-toast-comment">{socialReaction.comment}</span>
          <span className="social-toast-commenter">— {socialReaction.commenter}</span>
        </div>
      )}

      {clickMilestoneMsg && (
        <div className="social-toast click-milestone-toast">
          <span className="social-toast-comment">{clickMilestoneMsg}</span>
        </div>
      )}

      {showSecretStats && (
        <SecretStatsScreen
          bossMood={bossMood}
          voiceTally={voiceTally}
          easterEggsSeenCount={easterEggsSeenCount}
          pressureChoicesTaken={pressureChoicesTaken}
          onClose={() => setShowSecretStats(false)}
        />
      )}

      {showEmlahMenu && (
        <EmlahMenu
          initialTab={emlahMenuTab}
          balance={balance}
          ownedPerks={ownedPerks}
          consumables={consumables}
          unlockedTiers={unlockedTiers}
          onBuy={buyItem}
          jettons={jettons}
          shieldHousesLeft={shieldHousesLeftState}
          hasRetryCandidate={pickSecondChanceCandidateIndex(results) !== null}
          onBuyInventoryItem={handleBuyInventoryItem}
          results={results}
          allHouses={allHouses}
          houseOrder={houseOrder}
          currentIndex={index}
          rankTitleText={rankTitle(earned)}
          reputationText={reputationLabelDisplay(reputationLabel(results))}
          earned={earned}
          badges={badges}
          allBadges={allBadges}
          tasksCompleted={tasksCompleted}
          chitchatBonuses={chitchatBonuses}
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
          bossMood={bossMood}
          friendBonds={friendBonds}
          friendBondCounts={friendBondCounts}
          friendFavorAccepted={friendFavorAccepted}
          voiceTally={voiceTally}
          compassTally={compassTally}
          friendHouses={friendHouses}
          unlockedFriendHouseIds={unlockedFriendHouseIds}
          friendHouseResults={friendHouseResults}
          onOpenFriendHouse={openFriendHouse}
          contacts={buildContactBook(results, premiumResults, investmentResults, castAssignment)}
          districtPins={buildDistrictPins(results, premiumResults, investmentResults, friendHouseResults)}
          defeatedRivalIds={defeatedRivalIds}
          ownedSkillIds={ownedSkillIds}
          skillXP={skillXP}
          onUnlockSkill={unlockSkill}
          keyHintDistrict={sq.keyMapHint}
        />
      )}

      {showMessagesOnly && (
        <div className="modal-overlay msg-overlay" onClick={() => setShowMessagesOnly(false)}>
          <div className="msg-phone" onClick={(e) => e.stopPropagation()}>
            <div className="msg-phone-statusbar">
              <span>{gameTimeForIndex(index)}</span>
              <span className="msg-phone-notch" aria-hidden />
              <span>{phoneBattery}%</span>
            </div>
            <MessagesPanel
              inbox={inbox}
              results={results}
              onRetry={retryFromInbox}
              onFollowUp={followUpThinking}
              pendingFriendFavors={pendingFriendFavors}
              onFriendFavor={resolveFriendFavor}
              friendBondCounts={friendBondCounts}
              hardTimesUsed={hardTimesUsed}
              emlahStruggling={emlahStruggling}
              onAskForHelp={resolveHardTimesAsk}
              onMarkRead={markThreadAsRead}
              avatarFor={(threadId, name) =>
                contactAvatar(name, allHouses.some((h) => h.id === threadId) ? threadId : undefined, castAssignment)
              }
              onClose={() => setShowMessagesOnly(false)}
              initialThreadId={messagesInitialThread}
            />
            <div className="phone-home-indicator" />
          </div>
        </div>
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

      {activeSecretHouseId && secretHouseById(activeSecretHouseId) && (
        <div className="premium-overlay">
          <div className="premium-overlay-inner">
            <PremiumHouseScene
              house={secretHouseById(activeSecretHouseId)!}
              ownedPerks={ownedPerks}
              consumables={consumables}
              castAssignment={castAssignment}
              results={results}
              allHouses={allHouses}
              onFinish={finishSecretHouse}
              energy={energy}
            />
          </div>
        </div>
      )}

      {activeFriendHouseId && (
        <div className="premium-overlay">
          <div className="premium-overlay-inner">
            <PremiumHouseScene
              house={friendHouseById(activeFriendHouseId)!}
              ownedPerks={ownedPerks}
              consumables={consumables}
              castAssignment={castAssignment}
              results={results}
              allHouses={allHouses}
              onFinish={finishFriendHouse}
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
        <MainMenu hasSave={hasSave} language={language} onNewGame={() => setStage("setup")} onOpenSaved={openSaved} onSettings={openSettings} />
      )}

      {stage === "setup" && (
        <NewGameSetupScreen onContinue={() => setStage("origin")} onBack={() => setStage("menu")} />
      )}

      {stage === "origin" && (
        <OriginSelectScreen origins={origins} onSelect={startNewGame} onBack={() => setStage("setup")} />
      )}

      {stage === "saved" && (
        <SavedGames saves={savedGames} onContinue={continueSaved} onDelete={deleteSaved} onBack={() => setStage("menu")} />
      )}

      {stage === "settings" && (
        <SettingsScreen
          language={language}
          onLanguageChange={setLanguage}
          languageLocked={preSettingsStageRef.current !== "menu"}
          onOpenStore={() => setStage("store")}
          onExitGame={preSettingsStageRef.current !== "menu" ? exitToMainMenu : undefined}
          onBack={() => setStage(preSettingsStageRef.current)}
        />
      )}

      {stage === "store" && (
        <StoreScreen
          language={language}
          jettons={jettons}
          fullUnlocked={fullUnlockedState}
          onBuyJetton={handleBuyJettonPackage}
          onBuyFullVersion={handleBuyFullVersionFromStore}
          onBuyBundleFullJetton30={handleBuyBundleFullJetton30}
          onRestorePurchases={handleRestorePurchases}
          onBack={() => {
            const back = storeReturnStageRef.current;
            storeReturnStageRef.current = "settings";
            setStage(back);
          }}
        />
      )}

      {stage === "locked" && (() => {
        const tierPerk = perks.find((p) => p.unlocksTier === house.tier);
        const soldCount = results.filter((r) => r.outcome === "sold").length;
        const ofisCount = countOwnedOfisItems(ownedPerks);
        const tierPrice = tierPerk ? effectiveCost(tierPerk, badges, weekIndexForHouse(index)) : 0;
        const callbackCandidates = results
          .map((r) => ({ r, h: allHouses.find((x) => x.id === r.houseId) }))
          .filter(({ r, h }) => h && ((r.outcome === "lost" && !r.retriedLost) || (r.outcome === "thinking" && !r.followedUpThinking)));
        return (
          <div className="result-screen locked-preview">
            <p className="locked-preview-tag">
              <LockIcon size={14} className="icon-inline" /> Tier {house.tier} — {t({ tr: "henüz erişimin yok", en: "you don't have access yet" })}
            </p>
            <p className="locked-preview-title">{resolveHouseTitle(house)}</p>
            <p className="locked-preview-location">{resolveHouseLocation(house)}</p>
            <p className="locked-preview-price">{formatTL(house.askingPrice)}</p>

            {tierPerk && (
              <ul className="locked-requirements">
                {tierPerk.requiresSoldCount !== undefined && (
                  <li className={soldCount >= tierPerk.requiresSoldCount ? "met" : ""}>
                    <ReqMark met={soldCount >= tierPerk.requiresSoldCount} /> {t({ tr: "Satış", en: "Sales" })}: {soldCount}/{tierPerk.requiresSoldCount}
                  </li>
                )}
                {tierPerk.requiresOfisItemCount !== undefined && (
                  <li className={ofisCount >= tierPerk.requiresOfisItemCount ? "met" : ""}>
                    <ReqMark met={ofisCount >= tierPerk.requiresOfisItemCount} /> {t({ tr: "Ofis eşyası", en: "Office items" })}: {ofisCount}/{tierPerk.requiresOfisItemCount}
                  </li>
                )}
                <li className={balance >= tierPrice ? "met" : ""}>
                  <ReqMark met={balance >= tierPrice} /> {t({ tr: "Bakiye", en: "Balance" })}: {formatTL(balance)} / {formatTL(tierPrice)}
                </li>
              </ul>
            )}

            <button className="pixel-btn" onClick={() => openEmlahMenu("market")}>
              {t({ tr: "Çarşıyı Aç", en: "Open the Bazaar" })}
            </button>

            <div className="locked-section">
              <p className="locked-section-title"><PhoneCallIcon size={12} className="icon-inline" /> {t({ tr: "Kaçan Müşterileri Tekrar Ara", en: "Call Back Missed Customers" })}</p>
              {callbackCandidates.length === 0 ? (
                <p className="menu-empty">
                  {t({ tr: "Tekrar aranabilecek müşteri kalmadı.", en: "There are no customers left to call back." })}
                </p>
              ) : (
                <div className="locked-callback-list">
                  {callbackCandidates.map(({ r, h }) => (
                    <button
                      key={r.houseId}
                      className="choice-btn locked-callback-btn"
                      onClick={() => (r.outcome === "lost" ? retryFromInbox(r.houseId) : followUpThinking(r.houseId))}
                    >
                      <span>{[resolveCustomerNames(h!, castAssignment)[0], resolveHouseTitle(h!)].filter(Boolean).join(" — ")}</span>
                      <span className="locked-callback-tag">
                        {r.outcome === "lost" ? t({ tr: "kaçtı", en: "lost" }) : t({ tr: "düşünüyor", en: "thinking" })}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="locked-section">
              <p className="locked-skip-text">
                {t({
                  tr: "İstersen eski müşterilere dönmek yerine ufak bir yardımla bu kısmı atlayabilirsin...",
                  en: "If you'd rather not chase old customers, a little help can get you past this part...",
                })}
              </p>
              <button className="pixel-btn locked-skip-btn" onClick={skipTierWithJettons}>
                <CoinIcon size={12} className="icon-inline" /> {t({ tr: `${TIER_SKIP_JETTON_COST} Jetton ile Geç`, en: `Skip for ${TIER_SKIP_JETTON_COST} Jettons` })}
              </button>
              <p className="locked-skip-balance">
                {t({ tr: `Bakiyen: ${jettons} Jetton`, en: `Your balance: ${jettons} Jettons` })}
              </p>
            </div>
          </div>
        );
      })()}

      {stage === "paywall" && (
        <PaywallScreen
          language={language}
          onUnlocked={() => {
            setFullUnlockedState(true);
            setStage("phone");
          }}
          onBack={() => setStage("menu")}
        />
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
          statusText={t({ tr: "mesaj yazdı", en: "sent a message" })}
          choices={withLowBatteryChoice(activeCallback.choices?.map((c) => ({ id: c.id, text: resolveText(c.text) })))}
          onChoice={handleNegotiationChoice}
          onContinue={() => {
            setActiveCallback(null);
            setStage("phone");
          }}
          batteryPercent={phoneBattery}
          statusTime={gameTimeForIndex(index)}
        />
      )}

      {inOffice && (
        // S1 — ofisin alt sekme çubuğu. DOM'da OfficeScene'den ÖNCE durur (görsel
        // olarak sabit/altta): böylece ".office-messages-btn" ilk eşleşme
        // Telefon (Mesajlar), son eşleşme ofisteki İşler düğmesi olarak kalır.
        <nav className="bottom-nav" aria-label={t({ tr: "Ana gezinme", en: "Main navigation" })}>
          <button className="bottom-nav-btn bottom-nav-active" aria-current="page">
            <OfficeIcon size={20} />
            <span>{t({ tr: "Ofis", en: "Office" })}</span>
          </button>
          <button className="bottom-nav-btn office-messages-btn" onClick={() => openMessagesOnly()}>
            <PhoneDeviceIcon size={20} />
            <span>{t({ tr: "Telefon", en: "Phone" })}</span>
            {unreadCount > 0 && (
              <span className="bottom-nav-badge" key={unreadCount}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <button className="bottom-nav-btn wallet-pill-btn" onClick={() => openEmlahMenu("market")}>
            <IdCardIcon size={20} />
            <span>{t({ tr: "Emlah", en: "Estetan" })}</span>
          </button>
          <button className="bottom-nav-btn" onClick={openStoreFromGame}>
            <ShopBagIcon size={20} />
            <span>{t({ tr: "Mağaza", en: "Store" })}</span>
          </button>
        </nav>
      )}

      {stage === "phone" && intro && !showPhoneOverlay && (
        <OfficeScene
          rankTitleText={rankTitle(earned)}
          ownedPerks={ownedPerks}
          energy={energy}
          bossMood={bossMood}
          currentDateLabel={formatGameDateTime(index)}
          seasonalFilter={seasonalFilterFragment(gameDateForIndex(index))}
          prestigeTitle={prestigeTitleThisRun}
          dayAdvanced={dayAdvanced}
          jobAvailable={jobAvailable}
          pausedVisit={pausedVisit}
          dayActivitiesDone={dayActivitiesDone}
          onAdvanceDay={handleAdvanceDay}
          onDoActivity={handleDoDayActivity}
          onGetJob={() => {
            if (!isFullUnlocked() && index >= DEMO_HOUSE_LIMIT) {
              track("paywall_shown", { from: "job" });
              setStage("paywall");
              return;
            }
            if (energy < ENERGY_WORK_MIN_THRESHOLD) {
              setShowEnergyBreak(true);
              return;
            }
            setShowPhoneOverlay(true);
            drainPhoneBattery();
            // G7 — eski üst bildirim yerine: arada bir kozmetik bir "boş" mesaj Telefon'a düşer (bildirimsiz).
            if (Math.random() < 0.5) {
              const flavor = pickWhatsAppNotification();
              setInbox((prev) => logFlavorMessage(prev, flavor.name, flavor.text, index + 1));
            }
          }}
          onOpenIsler={() => setShowIsler(true)}
          onOpenEnergyBreak={() => setShowEnergyBreak(true)}
          onTitleTap={handleOfficeTitleTap}
          badges={badges}
          allBadges={allBadges}
          significantMemories={significantMemories}
          sideCards={sq.officeCards}
          specialDayBanner={sq.specialDay ? resolveText(sq.specialDay.banner) : null}
          festive={!!sq.specialDay?.festive}
          night={isNightHours()}
        />
      )}

      {activeActivityGame && activityMiniGames[activeActivityGame] && (() => {
        const Game = activityMiniGames[activeActivityGame];
        const rewardLabels: [string, string, string] =
          activeActivityGame === "marketing"
            ? [
                t({ tr: `Patron +${MARKETING_BOSS_MOOD_BY_TIER[0]}`, en: `Boss +${MARKETING_BOSS_MOOD_BY_TIER[0]}` }),
                t({ tr: `Patron +${MARKETING_BOSS_MOOD_BY_TIER[1]}`, en: `Boss +${MARKETING_BOSS_MOOD_BY_TIER[1]}` }),
                t({
                  tr: `Patron +${MARKETING_BOSS_MOOD_BY_TIER[2]} · müşteri +${MARKETING_PERFECT_INTEREST} ilgi`,
                  en: `Boss +${MARKETING_BOSS_MOOD_BY_TIER[2]} · client +${MARKETING_PERFECT_INTEREST} interest`,
                }),
              ]
            : [
                `+${formatTL(OFFICE_WORK_EARNINGS_BY_TIER[0])}`,
                `+${formatTL(OFFICE_WORK_EARNINGS_BY_TIER[1])}`,
                `+${formatTL(OFFICE_WORK_EARNINGS_BY_TIER[2])} · ${t({ tr: "unutulmuş dosya şansı", en: "forgotten file chance" })}`,
              ];
        return (
          <div className="modal-overlay">
            <div className="market-modal activity-game-modal">
              <Game
                rewardLabels={rewardLabels}
                specialSigner={activeActivityGame === "office-work" ? tapuSigner : null}
                onFinish={(tier, secret) => {
                  if (secret === "cat") sq.onCatPhotographer();
                  if (secret === "forgery-firat" || secret === "forgery-former") sq.onTapuForgeryCaught(secret === "forgery-firat" ? "firat" : "former");
                  if (tier === 2) playReward();
                  else if (tier === 1) playThinking();
                  else playLost();
                  return activeActivityGame === "office-work" && tier === 2 ? rollForgottenFile() : null;
                }}
                onComplete={(tier) => {
                  applyDayActivity(activeActivityGame, tier);
                  setActiveActivityGame(null);
                }}
              />
            </div>
          </div>
        );
      })()}

      {showIsler && (
        <IslerPanel
          pausedVisit={pausedVisit}
          pausedVisitOffer={pausedVisitOffer}
          results={results}
          allHouses={allHouses}
          onGoNow={handleGoNowPausedVisit}
          onPostpone={handlePostponePausedVisit}
          onDecline={handleDeclinePausedVisit}
          onRescheduleResponse={handleRescheduleResponse}
          onClose={() => {
            setShowIsler(false);
            setPausedVisitOffer(null);
          }}
        />
      )}

      {stage === "phone" && intro && showPhoneOverlay && (
        <PhoneScreen
          key={house.id}
          messages={
            introFlavorMsg
              ? [introFlavorMsg, ...intro.messages.map((m) => ({ from: m.from, text: resolveText(m.text) }))]
              : intro.messages.map((m) => ({ from: m.from, text: resolveText(m.text) }))
          }
          thought={resolveText(intro.thought)}
          onContinue={afterIntro}
          choices={[
            { id: "visit", text: t({ tr: "Evi Gez", en: "Tour the House" }) },
            { id: "office", text: t({ tr: "Ofise Dön", en: "Return to Office" }) },
          ]}
          onChoice={handleIntroChoice}
          batteryPercent={phoneBattery}
          statusTime={gameTimeForIndex(index)}
        />
      )}

      {stage === "chitchat" && activeChitchat && (
        <PhoneScreen
          key={`chitchat-${activeChitchat.set.id}-${index}`}
          messages={activeChitchat.messages}
          choices={
            activeChitchat.showChoices
              ? withLowBatteryChoice(activeChitchat.set.choices.map((c) => ({ id: c.id, text: resolveText(c.text) })))
              : undefined
          }
          onChoice={handleChitchatChoice}
          onContinue={() => {
            setActiveChitchat(null);
            setStage("house");
          }}
          batteryPercent={phoneBattery}
          statusTime={gameTimeForIndex(index)}
        />
      )}

      {stage === "chitchat" && activeFriendChat && (
        <PhoneScreen
          key={`friend-${activeFriendChat.set.id}-${index}`}
          contactName={activeFriendChat.set.contactName}
          messages={activeFriendChat.messages}
          choices={
            activeFriendChat.showChoices
              ? withLowBatteryChoice(activeFriendChat.set.choices.map((c) => ({ id: c.id, text: resolveText(c.text) })))
              : undefined
          }
          onChoice={handleFriendChoice}
          onContinue={() => {
            setActiveFriendChat(null);
            setStage("house");
          }}
          batteryPercent={phoneBattery}
          statusTime={gameTimeForIndex(index)}
        />
      )}

      {stage === "chitchat" && activeMeetup && (
        <PhoneScreen
          key={`meetup-${activeMeetup.characterId}-${index}`}
          contactName={activeMeetup.characterName}
          messages={activeMeetup.messages}
          choices={
            activeMeetup.showChoices
              ? withLowBatteryChoice([
                  ...meetupActivities.map((a) => ({ id: a.id, text: resolveText(a.label) })),
                  { id: "decline", text: t({ tr: '"Şu an vaktim yok açıkçası."', en: '"I honestly don\'t have time right now."' }) },
                ])
              : undefined
          }
          onChoice={handleMeetupChoice}
          onContinue={() => {
            setActiveMeetup(null);
            setStage("house");
          }}
          batteryPercent={phoneBattery}
          statusTime={gameTimeForIndex(index)}
        />
      )}

      {stage === "task" && activeTask && <WorkTaskScreen task={activeTask} onChoice={completeWorkTask} />}

      {stage === "quickcall" && activeTask && <QuickCallScreen task={activeTask} onChoice={completeWorkTask} />}

      {stage === "postsalecall" && activePostSaleCall && (
        <PostSaleCallScreen call={activePostSaleCall.def} contactName={activePostSaleCall.contactName} onChoice={completePostSaleCall} />
      )}

      {stage === "house" && !saleIntroConfirmed && (
        <SaleIntroModal
          house={house}
          castAssignment={castAssignment}
          onConfirm={() => {
            startSaleMusic();
            setSaleIntroConfirmed(true);
          }}
          onBack={handleBackOutOfSale}
        />
      )}

      {stage === "house" && saleIntroConfirmed && (
        <>
          <StatsBar stats={stats} />
          {index === 0 && !tutorialDismissed && (
            // G8-a — yalnızca ilk oyunun ilk evinde: barların hemen altında küçük bir baloncuk.
            // İlk seçimde (ya da kapatınca) kapanır ve cihazda "görüldü" olarak kalır; sonraki oyunlarda çıkmaz.
            <div className="tutorial-tip tutorial-bubble" role="note">
              <p>
                {getLanguage() === "en" ? (
                  <>
                    Rising <strong>Suspicion</strong> makes the sale harder; <strong>Interest</strong> and <strong>Fun</strong> make it easier.
                    Balance the three with your answers.
                  </>
                ) : (
                  <>
                    <strong>Şüphe</strong> yükselirse satış zorlaşır; <strong>İlgi</strong> ve <strong>Eğlence</strong> kolaylaştırır. Cevaplarınla
                    üçünü dengele.
                  </>
                )}
              </p>
              <button className="tutorial-bubble-close" onClick={dismissTutorial} aria-label={t({ tr: "Anladım", en: "Got it" })}>
                <CloseIcon size={10} />
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
            onHeldFirm={handleHeldFirm}
            isDuel={activeDuelHouseId === house.id}
            duelRivalName={activeDuelHouseId === house.id ? activeRivalFor(defeatedRivalIds).name : undefined}
            firatEncounter={activeDuelHouseId === house.id ? (activeFiratMood ?? undefined) : undefined}
            easterEgg={activeEasterEgg?.houseId === house.id ? activeEasterEgg.egg : sideDialogue.intro}
            contactedCustomers={contactedCustomers}
            onToneChoice={handleToneChoice}
            voiceTally={voiceTally}
            onPressureChoicePicked={() => setPressureChoicesTaken((c) => c + 1)}
            origin={originById(origin)}
            showOriginIntro={index === 0}
            memoryReference={activeMemoryReference?.houseId === house.id ? activeMemoryReference.memory : undefined}
            onOriginChoicePicked={handleOriginChoicePicked}
            rankTitleText={rankTitle(earned)}
            ikramKind={ikramKind}
            onIkramUsed={handleIkramUsed}
            sideChoices={sideDialogue.choices}
            onSideChoice={(id) => sq.onSideChoice(id, house, index)}
            onAnyChoice={!tutorialDismissed ? dismissTutorial : undefined}
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
        <ResultCard
          result={lastResult}
          houseTitle={house ? resolveHouseTitle(house) : ""}
          customerName={house ? (resolveCustomerNames(house, castAssignment)[0] ?? "") : ""}
          avatarSrc={house ? contactAvatar(resolveCustomerNames(house, castAssignment)[0] ?? "", house.id, castAssignment) : undefined}
          isLastHouse={isLastHouse}
          newBadges={pendingNewBadges}
          onContinue={proceedAfterResult}
        />
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

      {stage === "summary" && showEndingSequence && (
        <EndingSequence slides={buildEndingSlides()} onFinish={() => setShowEndingSequence(false)} />
      )}

      {stage === "summary" && !showEndingSequence && (
        <div className="result-screen">
          <p>{t({ tr: "Bugünün özeti:", en: "Today's summary:" })}</p>
          {allHouses.map((h) => {
            const playedIdx = houseOrder.indexOf(allHouses.indexOf(h));
            const r = results[playedIdx];
            return (
              <p key={h.id}>
                {resolveHouseTitle(h)}: {r ? outcomeText(r.outcome) : "—"}
                {r?.converted ? ` (${t({ tr: "sonradan ikna oldu", en: "convinced later" })})` : ""}
              </p>
            );
          })}
          <p className="sale-summary">
            {t({ tr: "Toplam Kazanç", en: "Total Earnings" })}: {formatTL(earned)}
          </p>
          <p className="sale-summary">
            {t({ tr: "Bakiye", en: "Balance" })}: {formatTL(balance)}
          </p>
          <p className="sale-summary">
            {t({ tr: "Unvan", en: "Title" })}: {reputationLabelDisplay(reputationLabel(results))}
          </p>
          <p className="sale-summary">
            {t({ tr: "Kariyer", en: "Career" })}: {rankTitleDisplay(rankTitle(earned))}
          </p>
          {badges.length > 0 && (
            <div className="badge-popup">
              <p>{t({ tr: "Kazanılan rozetler:", en: "Badges earned:" })}</p>
              {badges.map((id) => (
                <p key={id}>
                  <MedalIcon size={14} className="icon-inline" /> {allBadges[id] ? resolveText(allBadges[id].title) : id}
                </p>
              ))}
            </div>
          )}
          {(() => {
            const ending = computeEnding(results, earned);
            const epilogue = originEndingLine(origin, resolveText(ending.title));
            return (
              <div className="ending-card">
                <p className="ending-title">{resolveText(ending.title)}</p>
                <p className="ending-description">{resolveText(ending.description)}</p>
                {epilogue && <p className="ending-description ending-epilogue">{epilogue}</p>}
              </div>
            );
          })()}
          <p className="muzaffer-note">
            Muzaffer Bey: "
            {anySold
              ? t({ tr: "Aferin aslanım, devam!", en: "Well done, keep it up!" })
              : t({ tr: "Emlah'ım biraz gayret.", en: "Come on Estetan, a bit more effort." })}
            "
          </p>
          {personalitySummary(voiceTally) && (
            <p className="ending-card">
              <span className="ending-title">{t({ tr: "Emlah'ın Kişilik Profili", en: "Estetan's Personality Profile" })}</span>
              <span className="ending-description">{personalitySummary(voiceTally)}</span>
            </p>
          )}
          {compassVerdict(compassTally) && (
            <p className="ending-card">
              <span className="ending-title">{t({ tr: "Değerler Pusulası", en: "Values Compass" })}</span>
              <span className="ending-description">{compassVerdict(compassTally)}</span>
            </p>
          )}
          <p className="menu-prestige-tag">
            <TrophyIcon size={12} className="icon-inline" />{" "}
            {t({
              tr: `Bu senin ${getPrestigeCompletions()}. turun! Yeni bir oyuna başladığında ${formatTL(prestigeStartingBonus(getPrestigeCompletions()))} ile başlayacaksın.`,
              en: `This is your playthrough #${getPrestigeCompletions()}! Your next game will start with ${formatTL(prestigeStartingBonus(getPrestigeCompletions()))}.`,
            })}
          </p>
          <button className="pixel-btn small" onClick={downloadShareCard}>
            {t({ tr: "Paylaşım Kartını İndir", en: "Download Share Card" })}
          </button>
          <button className="menu-btn" onClick={() => setStage("menu")}>
            {t({ tr: "Ana Menü", en: "Main Menu" })}
          </button>
        </div>
      )}
      </div>
      </Suspense>
    </div>
  );
}

export default App;
