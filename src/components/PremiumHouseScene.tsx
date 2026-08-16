import { useState } from "react";
import type { ChoiceEffects, GameStats, HouseResult, HouseScene, SceneOutcome } from "../types";
import DialogueScene from "./DialogueScene";
import ContractModal from "./ContractModal";
import { generateContract } from "../data/contract";
import { suspicionGainFactor, computeFreshStats } from "../data/scoring";
import { getDifficulty, difficultyMultiplier } from "../data/difficulty";
import { resolveCustomerNames } from "../data/characterPool";
import { reputationSuspicionOffset, districtReputationOffset, districtOf } from "../data/introFlavor";
import { ENERGY_LOW_THRESHOLD, ENERGY_LOW_SUSPICION_MULTIPLIER } from "../data/energy";

interface PremiumHouseSceneProps {
  house: HouseScene;
  ownedPerks: string[];
  consumables: Record<string, number>;
  castAssignment: Record<string, string[]>;
  results: HouseResult[];
  allHouses: HouseScene[];
  onFinish: (outcome: SceneOutcome, contractModifier: number, finalStats: GameStats) => void;
  /** Emlah'ın Enerjisi — same low-energy suspicion multiplier as the main house flow. */
  energy?: number;
  /** Yatırım Evleri only — see renovation.ts. Prepends a warning exchange to the opening dialogue. */
  conditionWarning?: boolean;
}

/**
 * One-off "Özel Davet" bonus house — reuses the same DialogueScene/
 * ContractModal building blocks as a normal house visit, but is entirely
 * self-contained (its own local stats, no fatigue, no week/index bookkeeping)
 * so it can't disturb the main houseOrder-driven flow. The caller only gets
 * a final outcome via onFinish and does the HouseResult/persist work itself.
 */
export default function PremiumHouseScene({
  house,
  ownedPerks,
  consumables,
  castAssignment,
  results,
  allHouses,
  onFinish,
  energy,
  conditionWarning,
}: PremiumHouseSceneProps) {
  const [stats, setStats] = useState<GameStats>(() => {
    const fresh = computeFreshStats(0, ownedPerks, consumables);
    const offset =
      reputationSuspicionOffset(results) + districtReputationOffset(results, allHouses, districtOf(house.location));
    return { ...fresh, suspicion: Math.max(0, fresh.suspicion + offset) };
  });
  const [stage, setStage] = useState<"dialogue" | "contract">("dialogue");

  function applyEffects(effects: ChoiceEffects) {
    const energyFactor = energy !== undefined && energy < ENERGY_LOW_THRESHOLD ? ENERGY_LOW_SUSPICION_MULTIPLIER : 1;
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

  function handleSceneEnd(outcome: SceneOutcome) {
    if (outcome === "sold") {
      setStage("contract");
      return;
    }
    onFinish(outcome, 0, stats);
  }

  if (stage === "contract") {
    return (
      <ContractModal
        clauses={generateContract()}
        customerName={resolveCustomerNames(house, castAssignment)[0]}
        onFinish={(modifier) => onFinish("sold", modifier, stats)}
      />
    );
  }

  return (
    <DialogueScene
      house={house}
      stats={stats}
      ownedPerks={ownedPerks}
      castAssignment={castAssignment}
      onChoiceEffects={applyEffects}
      onSceneEnd={handleSceneEnd}
      conditionWarning={conditionWarning}
    />
  );
}
