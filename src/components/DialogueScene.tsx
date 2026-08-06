import { useEffect, useState } from "react";
import type { ChoiceEffects, HouseScene, SceneOutcome } from "../types";
import { houseImages } from "../data/houseImages";
import { characterImages } from "../data/characterImages";

interface DialogueSceneProps {
  house: HouseScene;
  onChoiceEffects: (effects: ChoiceEffects) => void;
  onSceneEnd: (outcome: SceneOutcome) => void;
}

const speakerLabel: Record<string, string> = {
  emlah: "Emlah",
  thought: "Emlah (içinden)",
};

export default function DialogueScene({ house, onChoiceEffects, onSceneEnd }: DialogueSceneProps) {
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

  function pickChoice(next: string, effects?: ChoiceEffects) {
    if (effects) onChoiceEffects(effects);
    setNodeId(next);
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
          {house.title} — {house.location}
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
                onClick={() => pickChoice(c.next, c.effects)}
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
