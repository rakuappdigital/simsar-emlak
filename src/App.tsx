import { useState } from "react";
import PhoneScreen from "./components/PhoneScreen";
import DialogueScene from "./components/DialogueScene";
import StatsBar from "./components/StatsBar";
import { day1IntroMessages, day1IntroThought, day2IntroMessages, day2IntroThought } from "./data/intro";
import { houseKokuluStudyo, houseHayaletliDaire } from "./data/houses";
import type { ChoiceEffects, GameStats, SceneOutcome } from "./types";
import "./game.css";

type Stage = "phone1" | "house1" | "result1" | "phone2" | "house2" | "result2" | "summary";

const emptyStats: GameStats = { suspicion: 0, interest: 0, fun: 0 };

const outcomeText: Record<SceneOutcome, string> = {
  sold: "Satış tamamlandı! 🎉",
  thinking: "Müşteri düşünüyor...",
  lost: "Satış kaybedildi.",
};

function App() {
  const [stage, setStage] = useState<Stage>("phone1");
  const [stats, setStats] = useState<GameStats>(emptyStats);
  const [outcome1, setOutcome1] = useState<SceneOutcome | null>(null);
  const [outcome2, setOutcome2] = useState<SceneOutcome | null>(null);

  function applyEffects(effects: ChoiceEffects) {
    setStats((s) => ({
      suspicion: s.suspicion + (effects.suspicion ?? 0),
      interest: s.interest + (effects.interest ?? 0),
      fun: s.fun + (effects.fun ?? 0),
    }));
  }

  return (
    <div className="game-root">
      <header className="game-header">
        <h1>Simsar Emlak</h1>
        <span className="subtitle">Emlah'ın günü</span>
      </header>

      {stage === "phone1" && (
        <PhoneScreen
          messages={day1IntroMessages}
          thought={day1IntroThought}
          onContinue={() => setStage("house1")}
        />
      )}

      {stage === "house1" && (
        <>
          <StatsBar stats={stats} />
          <DialogueScene
            house={houseKokuluStudyo}
            onChoiceEffects={applyEffects}
            onSceneEnd={(outcome) => {
              setOutcome1(outcome);
              setStage("result1");
            }}
          />
        </>
      )}

      {stage === "result1" && outcome1 && (
        <div className="result-screen">
          <p>{outcomeText[outcome1]}</p>
          <button className="pixel-btn" onClick={() => { setStats(emptyStats); setStage("phone2"); }}>
            Devam Et
          </button>
        </div>
      )}

      {stage === "phone2" && (
        <PhoneScreen
          messages={day2IntroMessages}
          thought={day2IntroThought}
          onContinue={() => setStage("house2")}
        />
      )}

      {stage === "house2" && (
        <>
          <StatsBar stats={stats} />
          <DialogueScene
            house={houseHayaletliDaire}
            onChoiceEffects={applyEffects}
            onSceneEnd={(outcome) => {
              setOutcome2(outcome);
              setStage("result2");
            }}
          />
        </>
      )}

      {stage === "result2" && outcome2 && (
        <div className="result-screen">
          <p>{outcomeText[outcome2]}</p>
          <button className="pixel-btn" onClick={() => setStage("summary")}>
            Günü Bitir
          </button>
        </div>
      )}

      {stage === "summary" && (
        <div className="result-screen">
          <p>Bugünün özeti:</p>
          <p>Ev 1 — Kokulu Stüdyo: {outcome1 && outcomeText[outcome1]}</p>
          <p>Ev 2 — Hayaletli Daire: {outcome2 && outcomeText[outcome2]}</p>
          <p className="muzaffer-note">
            Muzaffer Bey: "{outcome1 === "sold" || outcome2 === "sold" ? "Aferin aslanım, devam!" : "Emlah'ım biraz gayret 😐"}"
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
