import { useState } from "react";
import PhoneScreen from "./components/PhoneScreen";
import DialogueScene from "./components/DialogueScene";
import StatsBar from "./components/StatsBar";
import { houseIntros, defaultIntro } from "./data/intro";
import { allHouses } from "./data/houses";
import { COMMISSION_RATE, formatTL } from "./data/economy";
import type { ChoiceEffects, GameStats, HouseScene, SceneOutcome } from "./types";
import "./game.css";

type Stage = "phone" | "house" | "result" | "summary";

interface SaleResult {
  finalPrice: number;
  commission: number;
  discountPercent: number;
}

interface HouseResult {
  outcome: SceneOutcome;
  sale: SaleResult | null;
}

const emptyStats: GameStats = { suspicion: 0, interest: 0, fun: 0, discountPercent: 0 };

const outcomeText: Record<SceneOutcome, string> = {
  sold: "Satış tamamlandı! 🎉",
  thinking: "Müşteri düşünüyor...",
  lost: "Satış kaybedildi.",
};

function computeSale(house: HouseScene, discountPercent: number): SaleResult {
  const finalPrice = house.askingPrice * (1 - discountPercent / 100);
  const commission = finalPrice * COMMISSION_RATE;
  return { finalPrice, commission, discountPercent };
}

function App() {
  const [stage, setStage] = useState<Stage>("phone");
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState<GameStats>(emptyStats);
  const [results, setResults] = useState<HouseResult[]>([]);

  const house = allHouses[index];
  const intro = houseIntros[house.id] ?? defaultIntro(house);
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

  function handleSceneEnd(outcome: SceneOutcome) {
    const sale = outcome === "sold" ? computeSale(house, stats.discountPercent) : null;
    setResults((r) => [...r, { outcome, sale }]);
    setStage("result");
  }

  function goNext() {
    setStats(emptyStats);
    if (isLastHouse) {
      setStage("summary");
    } else {
      setIndex((i) => i + 1);
      setStage("phone");
    }
  }

  const totalCommission = results.reduce((sum, r) => sum + (r.sale?.commission ?? 0), 0);
  const anySold = results.some((r) => r.outcome === "sold");

  return (
    <div className="game-root">
      <header className="game-header">
        <h1>Simsar Emlak</h1>
        <span className="subtitle">Emlah'ın günü — Ev {index + 1}/{allHouses.length}</span>
      </header>

      {stage === "phone" && (
        <PhoneScreen
          messages={intro.messages}
          thought={intro.thought}
          onContinue={() => setStage("house")}
        />
      )}

      {stage === "house" && (
        <>
          <StatsBar stats={stats} />
          <DialogueScene house={house} onChoiceEffects={applyEffects} onSceneEnd={handleSceneEnd} />
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
              <p>Komisyonunuz: {formatTL(lastResult.sale.commission)}</p>
            </div>
          )}
          <button className="pixel-btn" onClick={goNext}>
            {isLastHouse ? "Günü Bitir" : "Devam Et"}
          </button>
        </div>
      )}

      {stage === "summary" && (
        <div className="result-screen">
          <p>Bugünün özeti:</p>
          {allHouses.map((h, i) => (
            <p key={h.id}>
              {h.title}: {results[i] ? outcomeText[results[i].outcome] : "—"}
            </p>
          ))}
          <p className="sale-summary">Toplam Komisyon: {formatTL(totalCommission)}</p>
          <p className="muzaffer-note">
            Muzaffer Bey: "{anySold ? "Aferin aslanım, devam!" : "Emlah'ım biraz gayret 😐"}"
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
