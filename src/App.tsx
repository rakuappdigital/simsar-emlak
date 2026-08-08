import { useEffect, useState } from "react";
import PhoneScreen from "./components/PhoneScreen";
import DialogueScene from "./components/DialogueScene";
import StatsBar from "./components/StatsBar";
import MainMenu from "./components/MainMenu";
import SavedGames from "./components/SavedGames";
import SoundSettings from "./components/SoundSettings";
import WeekResult from "./components/WeekResult";
import ContractModal from "./components/ContractModal";
import { houseIntros, defaultIntro } from "./data/intro";
import { allHouses } from "./data/houses";
import { COMMISSION_RATE, formatTL } from "./data/economy";
import { resolveOutcome, streakMultiplier, fatigueSuspicion, rankBonus, rankTitle } from "./data/scoring";
import { computeStreak, checkNewBadges, allBadges } from "./data/badges";
import { HOUSES_PER_WEEK, isLastHouseOfWeek, weekIndexForHouse, evaluateWeek } from "./data/goals";
import { maybeGenerateCallback, negotiationChoices, type CallbackEvent } from "./data/callbacks";
import { loadSave, writeSave, clearSave } from "./data/save";
import { generateContract } from "./data/contract";
import { perks, hasPerk } from "./data/perks";
import { shuffledRange } from "./data/shuffle";
import { computeEnding } from "./data/endings";
import type {
  Badge,
  ChoiceEffects,
  ContractClause,
  GameStats,
  HouseResult,
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
  | "contract"
  | "result"
  | "weekGoal"
  | "summary";

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

function App() {
  const [stage, setStage] = useState<Stage>("menu");
  const [index, setIndex] = useState(0);
  const [houseOrder, setHouseOrder] = useState<number[]>(() => shuffledRange(allHouses.length));
  const [stats, setStats] = useState<GameStats>({ suspicion: 0, interest: 0, fun: 0, discountPercent: 0 });
  const [results, setResults] = useState<HouseResult[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [weekOutcomes, setWeekOutcomes] = useState<WeekOutcome[]>([]);
  const [ownedPerks, setOwnedPerks] = useState<string[]>([]);
  const [spent, setSpent] = useState(0);
  const [pendingNewBadges, setPendingNewBadges] = useState<Badge[]>([]);
  const [pendingWeekOutcome, setPendingWeekOutcome] = useState<WeekOutcome | null>(null);
  const [activeCallback, setActiveCallback] = useState<
    (CallbackEvent & { sessionKey: string }) | null
  >(null);
  const [contractClauses, setContractClauses] = useState<ContractClause[]>([]);
  const [savedGame, setSavedGame] = useState<SaveGame | null>(null);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    setHasSave(loadSave() !== null);
  }, []);

  const house = allHouses[houseOrder[index] ?? index];
  const intro = house ? (houseIntros[house.id] ?? defaultIntro(house)) : null;
  const isLastHouse = index === allHouses.length - 1;
  const lastResult = results[results.length - 1];

  function freshStats(forIndex: number = index, perksList: string[] = ownedPerks): GameStats {
    const positionInWeek = forIndex % HOUSES_PER_WEEK;
    const rested = hasPerk(perksList, "enerji-icecegi");
    return {
      suspicion: fatigueSuspicion(positionInWeek, rested),
      interest: 0,
      fun: hasPerk(perksList, "sansli-nal") ? 10 : 0,
      discountPercent: 0,
    };
  }

  function applyEffects(effects: ChoiceEffects) {
    const dampenSuspicion = hasPerk(ownedPerks, "ikna-kartviziti");
    setStats((s) => {
      const rawSuspicion = effects.suspicion ?? 0;
      const suspicionDelta = dampenSuspicion && rawSuspicion > 0 ? rawSuspicion * 0.8 : rawSuspicion;
      return {
        suspicion: s.suspicion + suspicionDelta,
        interest: s.interest + (effects.interest ?? 0),
        fun: s.fun + (effects.fun ?? 0),
        discountPercent: s.discountPercent + (effects.discountPercent ?? 0),
      };
    });
  }

  function enterPhone(newIndex: number, currentResults: HouseResult[], perksForChance: string[]) {
    if (newIndex > 0 && currentResults.length > 0) {
      const chanceBoost = hasPerk(perksForChance, "referans-agi");
      const callback = maybeGenerateCallback(currentResults, allHouses, chanceBoost);
      if (callback) {
        setActiveCallback({ ...callback, sessionKey: `${newIndex}-${callback.resultIndex}-${Date.now()}` });
        setIndex(newIndex);
        setStage("callback");
        return;
      }
    }
    setActiveCallback(null);
    setIndex(newIndex);
    setStage("phone");
  }

  function startNewGame() {
    const order = shuffledRange(allHouses.length);
    setHouseOrder(order);
    setIndex(0);
    setResults([]);
    setBadges([]);
    setWeekOutcomes([]);
    setOwnedPerks([]);
    setSpent(0);
    setStats(freshStats(0, []));
    clearSave();
    setHasSave(false);
    setActiveCallback(null);
    setIndex(0);
    setStage("phone");
  }

  function openSaved() {
    setSavedGame(loadSave());
    setStage("saved");
  }

  function continueSaved() {
    if (!savedGame) return;
    setHouseOrder(savedGame.houseOrder);
    setResults(savedGame.results);
    setBadges(savedGame.badges);
    setWeekOutcomes(savedGame.weekOutcomes);
    setOwnedPerks(savedGame.ownedPerks);
    setSpent(savedGame.spent);
    setStats(freshStats(savedGame.index, savedGame.ownedPerks));
    enterPhone(savedGame.index, savedGame.results, savedGame.ownedPerks);
  }

  function deleteSaved() {
    clearSave();
    setSavedGame(null);
    setHasSave(false);
  }

  function persist(newResults: HouseResult[], newWeekOutcomes: WeekOutcome[], newBadges: string[], newIndex: number, newOwnedPerks: string[], newSpent: number) {
    writeSave({
      version: 2,
      index: newIndex,
      houseOrder,
      results: newResults,
      weekOutcomes: newWeekOutcomes,
      badges: newBadges,
      ownedPerks: newOwnedPerks,
      spent: newSpent,
      savedAt: new Date().toISOString(),
    });
    setHasSave(true);
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
    };
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

    persist(newResults, newWeekOutcomes, newBadgesState, index + 1, ownedPerks, spent);
    setStage("result");
  }

  function proceedAfterResult() {
    setStats(freshStats(index + 1, ownedPerks));
    if (pendingWeekOutcome) {
      setStage("weekGoal");
      return;
    }
    if (isLastHouse) {
      setStage("summary");
    } else {
      enterPhone(index + 1, results, ownedPerks);
    }
  }

  function proceedAfterWeek() {
    setPendingWeekOutcome(null);
    setStats(freshStats(index + 1, ownedPerks));
    if (isLastHouse) {
      setStage("summary");
    } else {
      enterPhone(index + 1, results, ownedPerks);
    }
  }

  function buyPerk(perkId: string) {
    const perk = perks.find((p) => p.id === perkId);
    if (!perk || ownedPerks.includes(perkId)) return;
    if (balance < perk.cost) return;
    const newOwned = [...ownedPerks, perkId];
    const newSpent = spent + perk.cost;
    setOwnedPerks(newOwned);
    setSpent(newSpent);
    persist(results, weekOutcomes, badges, index + 1, newOwned, newSpent);
  }

  function handleNegotiationChoice(choiceId: string) {
    if (!activeCallback) return;
    const choice = negotiationChoices.find((c) => c.id === choiceId);
    if (!choice) return;

    const original = results[activeCallback.resultIndex];
    const targetHouse = allHouses.find((h) => h.id === original.houseId)!;
    const projected: GameStats = {
      suspicion: original.finalStats.suspicion + choice.suspicionDelta,
      interest: original.finalStats.interest + choice.interestDelta,
      fun: original.finalStats.fun + choice.funDelta,
      discountPercent: original.finalStats.discountPercent,
    };
    const outcome2: SceneOutcome = resolveOutcome(projected, choice.closingBias, targetHouse.profile);

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
    persist(newResults, weekOutcomes, badges, index, ownedPerks, spent);

    setActiveCallback((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, { from: prev.contactName, text: confirmText }] as PhoneMessage[],
            choices: undefined,
          }
        : prev,
    );
  }

  const earned =
    results.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0) +
    weekOutcomes.reduce((sum, w) => sum + w.bonus, 0);
  const balance = earned - spent;
  const anySold = results.some((r) => r.outcome === "sold");

  return (
    <div className="game-root">
      {stage !== "menu" && stage !== "saved" && stage !== "sounds" && (
        <header className="game-header">
          <h1>Simsar Emlak</h1>
          <span className="subtitle">
            Emlah'ın günü — Ev {index + 1}/{allHouses.length} · {rankTitle(earned)}
          </span>
          <span className="wallet-pill">💰 {formatTL(balance)}</span>
        </header>
      )}

      {stage === "menu" && (
        <MainMenu hasSave={hasSave} onNewGame={startNewGame} onOpenSaved={openSaved} onSounds={() => setStage("sounds")} />
      )}

      {stage === "saved" && (
        <SavedGames save={savedGame} onContinue={continueSaved} onDelete={deleteSaved} onBack={() => setStage("menu")} />
      )}

      {stage === "sounds" && <SoundSettings onBack={() => setStage("menu")} />}

      {stage === "callback" && activeCallback && (
        <PhoneScreen
          key={activeCallback.sessionKey}
          messages={activeCallback.messages}
          contactName={activeCallback.contactName}
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
        <PhoneScreen key={house.id} messages={intro.messages} thought={intro.thought} onContinue={() => setStage("house")} />
      )}

      {stage === "house" && (
        <>
          <StatsBar stats={stats} />
          <DialogueScene house={house} stats={stats} onChoiceEffects={applyEffects} onSceneEnd={handleSceneEnd} />
        </>
      )}

      {stage === "contract" && (
        <ContractModal
          clauses={contractClauses}
          customerName={house.customerNames[0]}
          onFinish={(modifier) => finalizeResult("sold", modifier)}
        />
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
              {lastResult.sale.streakBonus > 0 && <p>Seri bonusu: +%{Math.round(lastResult.sale.streakBonus * 100)} 🔥</p>}
              {lastResult.sale.rankBonus > 0 && <p>Rütbe bonusu: +%{Math.round(lastResult.sale.rankBonus * 100)} ⭐</p>}
              {lastResult.sale.contractModifier !== 0 && (
                <p>Sözleşme etkisi: {lastResult.sale.contractModifier > 0 ? "+" : ""}%{Math.round(lastResult.sale.contractModifier * 100)}</p>
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
        <WeekResult
          outcome={pendingWeekOutcome}
          balance={balance}
          ownedPerks={ownedPerks}
          onBuyPerk={buyPerk}
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
                <p key={id}>🏅 {allBadges[id]?.title ?? id}</p>
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
          <button className="menu-btn" onClick={() => setStage("menu")}>
            Ana Menü
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
