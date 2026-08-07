import { useEffect, useState } from "react";
import PhoneScreen from "./components/PhoneScreen";
import DialogueScene from "./components/DialogueScene";
import StatsBar from "./components/StatsBar";
import MainMenu from "./components/MainMenu";
import SavedGames from "./components/SavedGames";
import SoundSettings from "./components/SoundSettings";
import WeekResult from "./components/WeekResult";
import { houseIntros, defaultIntro } from "./data/intro";
import { allHouses } from "./data/houses";
import { COMMISSION_RATE, formatTL } from "./data/economy";
import { streakMultiplier } from "./data/scoring";
import { computeStreak, checkNewBadges, allBadges } from "./data/badges";
import { HOUSES_PER_WEEK, isLastHouseOfWeek, weekIndexForHouse, evaluateWeek } from "./data/goals";
import { maybeGenerateCallback } from "./data/callbacks";
import { loadSave, writeSave, clearSave } from "./data/save";
import type {
  Badge,
  ChoiceEffects,
  GameStats,
  HouseResult,
  HouseScene,
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
  | "sounds"
  | "callback"
  | "phone"
  | "house"
  | "result"
  | "weekGoal"
  | "summary";

const emptyStats: GameStats = { suspicion: 0, interest: 0, fun: 0, discountPercent: 0 };

const outcomeText: Record<SceneOutcome, string> = {
  sold: "Satış tamamlandı! 🎉",
  thinking: "Müşteri düşünüyor...",
  lost: "Satış kaybedildi.",
};

function computeSale(house: HouseScene, discountPercent: number, priorStreak: number): SaleResult {
  const finalPrice = house.askingPrice * (1 - discountPercent / 100);
  const baseCommission = finalPrice * COMMISSION_RATE;
  const streakBonus = streakMultiplier(priorStreak);
  const commission = baseCommission * (1 + streakBonus);
  return { finalPrice, commission, discountPercent, streakBonus };
}

function reputationLabel(results: HouseResult[]): string {
  if (results.length === 0) return "";
  const avg = results.reduce((s, r) => s + r.finalSuspicion, 0) / results.length;
  if (avg <= 25) return "Dürüst Simsar";
  if (avg <= 45) return "Dengeli Simsar";
  return "İstanbul'un En Sinsi Emlakçısı";
}

function App() {
  const [stage, setStage] = useState<Stage>("menu");
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState<GameStats>(emptyStats);
  const [results, setResults] = useState<HouseResult[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [weekOutcomes, setWeekOutcomes] = useState<WeekOutcome[]>([]);
  const [pendingNewBadges, setPendingNewBadges] = useState<Badge[]>([]);
  const [pendingWeekOutcome, setPendingWeekOutcome] = useState<WeekOutcome | null>(null);
  const [extraMessages, setExtraMessages] = useState<PhoneMessage[]>([]);
  const [callbackContact, setCallbackContact] = useState<string>("");
  const [savedGame, setSavedGame] = useState<SaveGame | null>(null);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    setHasSave(loadSave() !== null);
  }, []);

  const house = allHouses[index];
  const intro = house ? (houseIntros[house.id] ?? defaultIntro(house)) : null;
  const isLastHouse = index === allHouses.length - 1;
  const lastResult = results[results.length - 1];

  function applyEffects(effects: ChoiceEffects) {
    setStats((s) => ({
      suspicion: s.suspicion + (effects.suspicion ?? 0),
      interest: s.interest + (effects.interest ?? 0),
      fun: s.fun + (effects.fun ?? 0),
      discountPercent: s.discountPercent + (effects.discountPercent ?? 0),
    }));
  }

  function enterPhone(newIndex: number, currentResults: HouseResult[]) {
    let workingResults = currentResults;
    let extra: PhoneMessage[] = [];
    let contact = "";

    if (newIndex > 0 && currentResults.length > 0) {
      const callback = maybeGenerateCallback(currentResults, allHouses);
      if (callback) {
        extra = callback.messages;
        const callbackHouse = allHouses.find((h) => h.id === currentResults[callback.resultIndex].houseId);
        contact = callbackHouse?.customerNames[0] ?? "";
        if (callback.converts) {
          workingResults = currentResults.map((r, i) =>
            i === callback.resultIndex
              ? {
                  ...r,
                  outcome: "sold" as SceneOutcome,
                  converted: true,
                  sale: { finalPrice: callbackHouse!.askingPrice, commission: callback.bonusCommission, discountPercent: 0, streakBonus: 0 },
                }
              : r,
          );
          setResults(workingResults);
        }
      }
    }

    setExtraMessages(extra);
    setCallbackContact(contact);
    setIndex(newIndex);
    setStage(extra.length > 0 ? "callback" : "phone");
  }

  function startNewGame() {
    setIndex(0);
    setResults([]);
    setBadges([]);
    setWeekOutcomes([]);
    setStats(emptyStats);
    clearSave();
    setHasSave(false);
    enterPhone(0, []);
  }

  function openSaved() {
    setSavedGame(loadSave());
    setStage("saved");
  }

  function continueSaved() {
    if (!savedGame) return;
    setResults(savedGame.results);
    setBadges(savedGame.badges);
    setWeekOutcomes(savedGame.weekOutcomes);
    setStats(emptyStats);
    enterPhone(savedGame.index, savedGame.results);
  }

  function deleteSaved() {
    clearSave();
    setSavedGame(null);
    setHasSave(false);
  }

  function handleSceneEnd(outcome: SceneOutcome) {
    const priorStreak = computeStreak(results);
    const sale = outcome === "sold" ? computeSale(house, stats.discountPercent, priorStreak) : null;
    const newResult: HouseResult = { houseId: house.id, outcome, sale, finalSuspicion: stats.suspicion };
    const newResults = [...results, newResult];
    setResults(newResults);

    const gameComplete = index === allHouses.length - 1;
    const newlyEarned = checkNewBadges(newResults, gameComplete, badges);
    const newBadgeIds = newlyEarned.map((b) => b.id);
    const newBadgesState = [...badges, ...newBadgeIds];
    setBadges(newBadgesState);
    setPendingNewBadges(newlyEarned);

    let newWeekOutcomes = weekOutcomes;
    if (isLastHouseOfWeek(index)) {
      const weekIdx = weekIndexForHouse(index);
      const weekResults = newResults.slice(weekIdx * HOUSES_PER_WEEK, weekIdx * HOUSES_PER_WEEK + HOUSES_PER_WEEK);
      const weekOutcome = evaluateWeek(weekIdx, weekResults);
      newWeekOutcomes = [...weekOutcomes, weekOutcome];
      setWeekOutcomes(newWeekOutcomes);
      setPendingWeekOutcome(weekOutcome);
    } else {
      setPendingWeekOutcome(null);
    }

    writeSave({
      version: 1,
      index: index + 1,
      results: newResults,
      weekOutcomes: newWeekOutcomes,
      badges: newBadgesState,
      savedAt: new Date().toISOString(),
    });
    setHasSave(true);

    setStage("result");
  }

  function proceedAfterResult() {
    setStats(emptyStats);
    if (pendingWeekOutcome) {
      setStage("weekGoal");
      return;
    }
    if (isLastHouse) {
      setStage("summary");
    } else {
      enterPhone(index + 1, results);
    }
  }

  function proceedAfterWeek() {
    setPendingWeekOutcome(null);
    if (isLastHouse) {
      setStage("summary");
    } else {
      enterPhone(index + 1, results);
    }
  }

  const totalCommission =
    results.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0) +
    weekOutcomes.reduce((sum, w) => sum + w.bonus, 0);
  const anySold = results.some((r) => r.outcome === "sold");

  return (
    <div className="game-root">
      {stage !== "menu" && stage !== "saved" && stage !== "sounds" && (
        <header className="game-header">
          <h1>Simsar Emlak</h1>
          <span className="subtitle">Emlah'ın günü — Ev {index + 1}/{allHouses.length}</span>
        </header>
      )}

      {stage === "menu" && (
        <MainMenu
          hasSave={hasSave}
          onNewGame={startNewGame}
          onOpenSaved={openSaved}
          onSounds={() => setStage("sounds")}
        />
      )}

      {stage === "saved" && (
        <SavedGames
          save={savedGame}
          onContinue={continueSaved}
          onDelete={deleteSaved}
          onBack={() => setStage("menu")}
        />
      )}

      {stage === "sounds" && <SoundSettings onBack={() => setStage("menu")} />}

      {stage === "callback" && (
        <PhoneScreen
          messages={extraMessages}
          contactName={callbackContact}
          statusText="mesaj yazdı"
          onContinue={() => setStage("phone")}
        />
      )}

      {stage === "phone" && intro && (
        <PhoneScreen
          messages={intro.messages}
          thought={intro.thought}
          onContinue={() => setStage("house")}
        />
      )}

      {stage === "house" && (
        <>
          <StatsBar stats={stats} />
          <DialogueScene house={house} stats={stats} onChoiceEffects={applyEffects} onSceneEnd={handleSceneEnd} />
        </>
      )}

      {stage === "result" && lastResult && (
        <div className="result-screen">
          <p>{outcomeText[lastResult.outcome]}</p>
          {lastResult.sale && (
            <div className="sale-summary">
              <p>
                Satış Fiyatı: {formatTL(lastResult.sale.finalPrice)}
                {lastResult.sale.discountPercent > 0 && ` (%${lastResult.sale.discountPercent} indirimli)`}
              </p>
              {lastResult.sale.streakBonus > 0 && (
                <p>Seri bonusu: +%{Math.round(lastResult.sale.streakBonus * 100)} 🔥</p>
              )}
              <p>Komisyonunuz: {formatTL(lastResult.sale.commission)}</p>
            </div>
          )}
          {pendingNewBadges.length > 0 && (
            <div className="badge-popup">
              {pendingNewBadges.map((b) => (
                <p key={b.id}>🏅 Yeni rozet: {b.title}</p>
              ))}
            </div>
          )}
          <button className="pixel-btn" onClick={proceedAfterResult}>
            {isLastHouse ? "Günü Bitir" : "Devam Et"}
          </button>
        </div>
      )}

      {stage === "weekGoal" && pendingWeekOutcome && (
        <WeekResult outcome={pendingWeekOutcome} onContinue={proceedAfterWeek} />
      )}

      {stage === "summary" && (
        <div className="result-screen">
          <p>Bugünün özeti:</p>
          {allHouses.map((h, i) => (
            <p key={h.id}>
              {h.title}: {results[i] ? outcomeText[results[i].outcome] : "—"}
              {results[i]?.converted ? " (sonradan ikna oldu)" : ""}
            </p>
          ))}
          <p className="sale-summary">Toplam Komisyon: {formatTL(totalCommission)}</p>
          <p className="sale-summary">Unvan: {reputationLabel(results)}</p>
          {badges.length > 0 && (
            <div className="badge-popup">
              <p>Kazanılan rozetler:</p>
              {badges.map((id) => (
                <p key={id}>🏅 {allBadges[id]?.title ?? id}</p>
              ))}
            </div>
          )}
          <p className="muzaffer-note">
            Muzaffer Bey: "{anySold ? "Aferin aslanım, devam!" : "Emlah'ım biraz gayret 😐"}"
          </p>
          <button className="menu-btn" onClick={() => setStage("menu")}>
            Ana Menü
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
