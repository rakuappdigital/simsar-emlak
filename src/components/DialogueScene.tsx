import { useEffect, useState } from "react";
import type { Choice, ChoiceEffects, GameStats, HouseScene, SceneOutcome } from "../types";
import { houseImages } from "../data/houseImages";
import { characterImages } from "../data/characterImages";
import { formatTL } from "../data/economy";
import { resolveOutcome } from "../data/scoring";

interface DialogueSceneProps {
  house: HouseScene;
  stats: GameStats;
  onChoiceEffects: (effects: ChoiceEffects) => void;
  onSceneEnd: (outcome: SceneOutcome) => void;
}

const speakerLabel: Record<string, string> = {
  emlah: "Emlah",
  thought: "Emlah (içinden)",
};

export default function DialogueScene({ house, stats, onChoiceEffects, onSceneEnd }: DialogueSceneProps) {
  const [nodeId, setNodeId] = useState(house.startNode);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    setNodeId(house.startNode);
    setLineIndex(0);
  }, [house]);

  const node = house.nodes[nodeId];
  const linesShown = node.lines.slice(0, lineIndex + 1);
  const atLastLine = lineIndex >= node.lines.length - 1;

  function advanceLine() {
    if (!atLastLine) {
      setLineIndex((i) => i + 1);
      return;
    }
    if (node.end) {
      onSceneEnd(node.end);
      return;
    }
    if (node.next && !node.choices) {
      setNodeId(node.next);
      setLineIndex(0);
    }
  }

  function pickChoice(choice: Choice) {
    if (choice.effects) onChoiceEffects(choice.effects);

    if (choice.effects?.closingBias !== undefined) {
      const projected: GameStats = {
        suspicion: stats.suspicion + (choice.effects.suspicion ?? 0),
        interest: stats.interest + (choice.effects.interest ?? 0),
        fun: stats.fun + (choice.effects.fun ?? 0),
        discountPercent: stats.discountPercent + (choice.effects.discountPercent ?? 0),
      };
      const outcome = resolveOutcome(projected, choice.effects.closingBias);
      setNodeId(house.closingNodes[outcome]);
    } else {
      setNodeId(choice.next);
    }
    setLineIndex(0);
  }

  const image = houseImages[house.id];

  return (
    <div className="dialogue-scene">
      <div className="scene-stage">
        <div
          className={`pixel-bg ${image ? "" : house.background}`}
          style={image ? { backgroundImage: `url(${image})` } : undefined}
        />
        <div className="scene-title">
          <span>{house.title} — {house.location}</span>
          <span className="scene-price">{formatTL(house.askingPrice)}</span>
        </div>
      </div>

      <div className="dialogue-box" onClick={atLastLine ? undefined : advanceLine}>
        {linesShown.map((line, i) => {
          const displayName = line.name ?? speakerLabel[line.speaker] ?? "";
          if (line.speaker === "thought") {
            return (
              <div key={i} className="dialogue-line speaker-thought">
                <div className="dialogue-line-body">
                  <span className="speaker-name">{displayName}</span>
                  <span className="line-text">{line.text}</span>
                </div>
              </div>
            );
          }
          const portrait = characterImages[displayName];
          return (
            <div key={i} className={`dialogue-line speaker-${line.speaker}`}>
              {portrait ? (
                <img className="portrait-avatar" src={portrait} alt={displayName} />
              ) : (
                <div className="portrait-avatar portrait-placeholder" aria-hidden />
              )}
              <div className="dialogue-line-body">
                <span className="speaker-name">{displayName}</span>
                <span className="line-text">{line.text}</span>
              </div>
            </div>
          );
        })}

        {!atLastLine && (
          <button className="pixel-btn small" onClick={advanceLine}>
            Devam ▸
          </button>
        )}

        {atLastLine && node.choices && (
          <div className="choices">
            {node.choices.map((c) => (
              <button
                key={c.id}
                className="choice-btn"
                onClick={() => pickChoice(c)}
              >
                {c.text}
              </button>
            ))}
          </div>
        )}

        {atLastLine && !node.choices && (node.next || node.end) && (
          <button className="pixel-btn small" onClick={advanceLine}>
            {node.end ? "Sahneyi Bitir" : "Devam ▸"}
          </button>
        )}
      </div>
    </div>
  );
}
