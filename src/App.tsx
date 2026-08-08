import { useEffect, useState } from "react";
import PhoneScreen from "./components/PhoneScreen";
import DialogueScene from "./components/DialogueScene";
import StatsBar from "./components/StatsBar";
import MainMenu from "./components/MainMenu";
import SavedGames from "./components/SavedGames";
import SoundSettings from "./components/SoundSettings";
import WeekResult from "./components/WeekResult";
import ContractModal from "./components/ContractModal";
import MarketModal from "./components/MarketModal";
import { houseIntros, defaultIntro } from "./data/intro";
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
} from "./data/scoring";
import { computeStreak, checkNewBadges, allBadges } from "./data/badges";
import { HOUSES_PER_WEEK, isLastHouseOfWeek, weekIndexForHouse, evaluateWeek } from "./data/goals";
import { maybeGenerateCallback, negotiationChoices, type CallbackEvent } from "./data/callbacks";
import { loadSave, writeSave, clearSave } from "./data/save";
import { generateContract } from "./data/contract";
import { perks, hasPerk, consumableEffects } from "./data/perks";
import { tieredShuffle } from "./data/shuffle";
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
  | "locked"
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
  let stats: GameStats = {
    suspicion: fatigueSuspicion(positionInWeek, factor),
    interest: 0,
    fun: hasPerk(perksList, "sansli-nal") ? 10 : 0,
    discountPercent: 0,
  };
  if (hasPerk(perksList, "sik-gomlek")) stats.interest += 5;
  if (hasPerk(perksList, "luks-saat")) stats.interest += 8;
  if (hasPerk(perksList, "rahat-ayakkabi")) stats.fun += 5;
  if (hasPerk(perksList, "luks-arac")) stats.interest += 5;

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
  const [savedGame, setSavedGame] = useState<SaveGame | null>(null);
  const [hasSave, setHasSave] = useState(false);
  const [showMarket, setShowMarket] = useState(false);

  useEffect(() => {
    setHasSave(loadSave() !== null);
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
  ) {
    writeSave({
      version: 3,
      index: newIndex,
      houseOrder: newHouseOrder,
      results: newResults,
      weekOutcomes: newWeekOutcomes,
      badges: newBadges,
      ownedPerks: newOwnedPerks,
      consumables: newConsumables,
      unlockedTiers: newUnlockedTiers,
      spent: newSpent,
      savedAt: new Date().toISOString(),
    });
    setHasSave(true);
  }

  function applyEffects(effects: ChoiceEffects) {
    const suspicionFactor = suspicionGainFactor(ownedPerks);
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
  ) {
    const nextHouse = allHouses[order[newIndex] ?? newIndex];

    if (nextHouse.tier > Math.max(...tiersList)) {
      setIndex(newIndex);
      setStage("locked");
      return;
    }

    const positionInWeek = newIndex % HOUSES_PER_WEEK;
    const newStats = computeFreshStats(positionInWeek, perksList, consumablesList);
    setStats(newStats);
    const remainingConsumables = consumeOneOfEach(consumablesList);
    setConsumables(remainingConsumables);
    persist(currentResults, weekOutcomes, badges, newIndex, perksList, spent, remainingConsumables, tiersList, order);

    if (newIndex > 0 && currentResults.length > 0) {
      const chanceBoost = hasPerk(perksList, "referans-agi");
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

  // If a tier unlock happens while sitting on the "locked" gate, move on automatically.
  useEffect(() => {
    if (stage === "locked" && house.tier <= maxUnlockedTier) {
      enterPhone(index, results, ownedPerks, consumables, unlockedTiers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedTiers, stage]);

  function startNewGame() {
    const order = tieredShuffle(allHouses.map((h) => h.tier));
    setHouseOrder(order);
    setResults([]);
    setBadges([]);
    setWeekOutcomes([]);
    setOwnedPerks([]);
    setConsumables({});
    setUnlockedTiers([1]);
    setSpent(0);
    clearSave();
    setHasSave(false);
    setActiveCallback(null);
    enterPhone(0, [], [], {}, [1], order);
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
    setConsumables(savedGame.consumables);
    setUnlockedTiers(savedGame.unlockedTiers);
    setSpent(savedGame.spent);
    enterPhone(
      savedGame.index,
      savedGame.results,
      savedGame.ownedPerks,
      savedGame.consumables,
      savedGame.unlockedTiers,
      savedGame.houseOrder,
    );
  }

  function deleteSaved() {
    clearSave();
    setSavedGame(null);
    setHasSave(false);
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
    if (isLastHouse) {
      setStage("summary");
    } else {
      enterPhone(index + 1, results, ownedPerks, consumables, unlockedTiers);
    }
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
    persist(newResults, weekOutcomes, badges, index, ownedPerks, spent, consumables, unlockedTiers);

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
  const marketVisible = stage !== "menu" && stage !== "saved" && stage !== "sounds";

  return (
    <div className="game-root">
      {marketVisible && (
        <header className="game-header">
          <h1>Simsar Emlak</h1>
          <span className="subtitle">
            Emlah'ın günü — Ev {index + 1}/{allHouses.length} · {rankTitle(earned)}
          </span>
          <button className="wallet-pill wallet-pill-btn" onClick={() => setShowMarket(true)}>
            💰 {formatTL(balance)} · 🛒
          </button>
        </header>
      )}

      {showMarket && (
        <MarketModal
          balance={balance}
          ownedPerks={ownedPerks}
          consumables={consumables}
          unlockedTiers={unlockedTiers}
          onBuy={buyItem}
          onClose={() => setShowMarket(false)}
        />
      )}

      {stage === "menu" && (
        <MainMenu hasSave={hasSave} onNewGame={startNewGame} onOpenSaved={openSaved} onSounds={() => setStage("sounds")} />
      )}

      {stage === "saved" && (
        <SavedGames save={savedGame} onContinue={continueSaved} onDelete={deleteSaved} onBack={() => setStage("menu")} />
      )}

      {stage === "sounds" && <SoundSettings onBack={() => setStage("menu")} />}

      {stage === "locked" && (
        <div className="result-screen">
          <p>Bu ev Tier {house.tier} portföyünde — henüz erişimin yok.</p>
          <p className="menu-empty">Ofis Marketi'nden "Portföy Kilidi" bölümüne bakabilirsin.</p>
          <button className="pixel-btn" onClick={() => setShowMarket(true)}>
            Marketi Aç
          </button>
        </div>
      )}

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
          <DialogueScene
            house={house}
            stats={stats}
            ownedPerks={ownedPerks}
            onChoiceEffects={applyEffects}
            onSceneEnd={handleSceneEnd}
          />
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
          onOpenMarket={() => setShowMarket(true)}
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
